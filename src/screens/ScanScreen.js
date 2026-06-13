// =============================================================================
// src/screens/ScanScreen.js
// BLOCO: Tela de Escaneamento com IA
//
// Implementa o fluxo completo de classificação de resíduos:
//   1. Abre a câmera do dispositivo (expo-camera)
//   2. Captura a imagem
//   3. Envia para o módulo de IA (classifier.js)
//   4. Exibe o resultado com instruções de descarte
//
// O fluxo de estados é controlado pelo AFD definido em automaton.js,
// garantindo que o usuário só possa avançar por transições válidas.
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, Alert, Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { classifyImage, WASTE_CATEGORIES } from '../classifier';
import { AFD, STATES, EVENTS } from '../automaton';

// --------------------------------------------------
// BLOCO: Instância do AFD (Autômato Finito Determinístico)
// Criada fora do componente para manter o estado entre re-renders
// --------------------------------------------------
const afd = new AFD();

export default function ScanScreen({ navigation }) {

  // --------------------------------------------------
  // BLOCO: Estado React – controla a UI com base no AFD
  // --------------------------------------------------
  const [afdState,    setAfdState]    = useState(STATES.IDLE);
  const [resultado,   setResultado]   = useState(null);   // Resultado da classificação
  const [permission,  requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current; // Animação do botão

  // --------------------------------------------------
  // BLOCO: Animação de pulso no botão de captura
  // --------------------------------------------------
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.00, duration: 700, useNativeDriver: true }),
      ])
    );
    if (afdState === STATES.SCANNING) pulse.start();
    else pulse.stop();
    return () => pulse.stop();
  }, [afdState]);

  // --------------------------------------------------
  // FUNÇÃO: dispara um evento no AFD e atualiza o estado React
  // --------------------------------------------------
  function dispatch(event) {
    const ok = afd.dispatch(event);
    if (ok) setAfdState(afd.getState());
    return ok;
  }

  // --------------------------------------------------
  // FUNÇÃO: Abre a câmera (IDLE → SCANNING)
  // Solicita permissão se necessário
  // --------------------------------------------------
  async function handleOpenCamera() {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permissão negada', 'O app precisa da câmera para identificar resíduos.');
        return;
      }
    }
    dispatch(EVENTS.OPEN_CAMERA);
  }

  // --------------------------------------------------
  // FUNÇÃO: Captura a foto e aciona a classificação IA
  // SCANNING → CLASSIFYING → RESULT_SHOWN (ou ERROR)
  // --------------------------------------------------
  async function handleCapture() {
    if (!cameraRef.current) return;

    dispatch(EVENTS.CAPTURE_IMAGE); // SCANNING → CLASSIFYING

    try {
      // Captura a imagem com qualidade média para não sobrecarregar a rede
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.6 });

      // Chama o módulo de IA com o URI da imagem
      const classificacao = await classifyImage(photo.uri);

      setResultado(classificacao);
      dispatch(EVENTS.CLASSIFICATION_OK); // CLASSIFYING → RESULT_SHOWN
    } catch (error) {
      dispatch(EVENTS.CLASSIFICATION_FAIL); // → ERROR
      Alert.alert('Erro na IA', error.message, [
        { text: 'Tentar novamente', onPress: handleReset },
      ]);
    }
  }

  // --------------------------------------------------
  // FUNÇÃO: Reinicia o fluxo (qualquer estado → IDLE)
  // --------------------------------------------------
  function handleReset() {
    afd.reset();
    setAfdState(STATES.IDLE);
    setResultado(null);
  }

  // --------------------------------------------------
  // BLOCO: Renderização condicional por estado do AFD
  // --------------------------------------------------

  // Estado IDLE: tela de boas-vindas ao escaneamento
  if (afdState === STATES.IDLE) {
    return (
      <View style={styles.container}>
        <View style={styles.idleContent}>
          <Text style={styles.idleIcon}>🔍</Text>
          <Text style={styles.idleTitle}>Identificar Resíduo</Text>
          <Text style={styles.idleDesc}>
            Aponte a câmera para qualquer resíduo e nossa IA irá classificá-lo
            automaticamente, indicando como e onde descartar corretamente.
          </Text>

          {/* Exibe os estados do AFD para fins didáticos na apresentação */}
          <View style={styles.afdBox}>
            <Text style={styles.afdTitle}>🤖 AFD – Estado atual</Text>
            <Text style={styles.afdState}>q₀ = {afdState.toUpperCase()}</Text>
            <Text style={styles.afdSubtitle}>M = (Q, Σ, δ, q₀, F)</Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={handleOpenCamera}>
            <Text style={styles.startButtonText}>📷  Abrir Câmera</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Estado SCANNING: câmera ativa
  if (afdState === STATES.SCANNING) {
    return (
      <View style={styles.container}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          {/* Guia de enquadramento */}
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanHint}>Enquadre o resíduo no centro</Text>
          </View>

          {/* Botão de captura */}
          <View style={styles.captureBar}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleReset}>
              <Text style={styles.cancelText}>✕ Cancelar</Text>
            </TouchableOpacity>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
                <View style={styles.captureInner} />
              </TouchableOpacity>
            </Animated.View>
            <View style={{ width: 80 }} />
          </View>
        </CameraView>
      </View>
    );
  }

  // Estado CLASSIFYING: spinner enquanto a IA processa
  if (afdState === STATES.CLASSIFYING) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingTitle}>🧠 IA Processando…</Text>
        <Text style={styles.loadingDesc}>Analisando o resíduo com visão computacional</Text>
        <Text style={styles.afdStateSmall}>δ(scanning, CAPTURE_IMAGE) → classifying</Text>
      </View>
    );
  }

  // Estado RESULT_SHOWN: exibe resultado da classificação
  if (afdState === STATES.RESULT_SHOWN && resultado) {
    const { category, confidence } = resultado;
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Cabeçalho com cor da categoria */}
        <View style={[styles.resultHeader, { backgroundColor: category.color }]}>
          <Text style={styles.resultIcon}>{category.icon}</Text>
          <Text style={styles.resultLabel}>{category.label}</Text>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>🎯 {confidence}% confiança</Text>
          </View>
          <View style={styles.lixeiraBadge}>
            <Text style={styles.lixeiraText}>🗑️ Lixeira {category.lixeira}</Text>
          </View>
        </View>

        {/* Instruções de descarte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como descartar:</Text>
          {category.instrucoes.map((inst, i) => (
            <View key={i} style={styles.instrucaoRow}>
              <Text style={styles.instrucaoBullet}>✓</Text>
              <Text style={styles.instrucaoText}>{inst}</Text>
            </View>
          ))}
        </View>

        {/* Exemplos de materiais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exemplos:</Text>
          <View style={styles.examplesWrap}>
            {category.exemplos.map((ex, i) => (
              <View key={i} style={[styles.exampleChip, { borderColor: category.color }]}>
                <Text style={[styles.exampleText, { color: category.color }]}>{ex}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Botão: Encontrar Ecoponto */}
        <TouchableOpacity
          style={[styles.ecoButton, { backgroundColor: category.color }]}
          onPress={() => {
            dispatch(EVENTS.REQUEST_ROUTE);
            navigation.navigate('Ecopontos', { categoria: category.id });
          }}
        >
          <Text style={styles.ecoButtonText}>📍 Encontrar Ecoponto Próximo</Text>
        </TouchableOpacity>

        {/* Botão: Escanear novamente */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>🔄 Escanear Outro Resíduo</Text>
        </TouchableOpacity>

        {/* Diagrama de estado do AFD (didático) */}
        <View style={styles.afdBox}>
          <Text style={styles.afdTitle}>🤖 Histórico do AFD</Text>
          <Text style={styles.afdState}>
            {afd.history.map((s, i) =>
              i < afd.history.length - 1 ? `${s} →\n` : s
            ).join('')}
          </Text>
        </View>

      </ScrollView>
    );
  }

  // Estado ERROR: fallback
  return (
    <View style={styles.loadingContainer}>
      <Text style={{ fontSize: 48 }}>⚠️</Text>
      <Text style={styles.loadingTitle}>Algo deu errado</Text>
      <TouchableOpacity style={styles.startButton} onPress={handleReset}>
        <Text style={styles.startButtonText}>Tentar Novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

// --------------------------------------------------
// BLOCO: Estilos da ScanScreen
// --------------------------------------------------
const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: COLORS.background },
  camera:           { flex: 1 },

  idleContent:      {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: SPACING.xl,
  },
  idleIcon:         { fontSize: 64, marginBottom: SPACING.md },
  idleTitle:        { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.primary, textAlign: 'center' },
  idleDesc:         {
    fontSize: FONTS.sizes.md, color: COLORS.textSecondary,
    textAlign: 'center', marginTop: SPACING.sm, lineHeight: 24,
  },
  afdBox:           {
    marginTop: SPACING.lg, backgroundColor: '#1B2B1B',
    borderRadius: RADIUS.md, padding: SPACING.md, width: '100%',
  },
  afdTitle:         { color: '#4CAF50', fontSize: FONTS.sizes.sm, fontWeight: '700' },
  afdState:         { color: '#A5D6A7', fontFamily: 'monospace', marginTop: 4, fontSize: FONTS.sizes.sm },
  afdSubtitle:      { color: '#616161', fontSize: FONTS.sizes.xs, marginTop: 4 },
  afdStateSmall:    { color: '#9E9E9E', fontSize: FONTS.sizes.xs, fontFamily: 'monospace', marginTop: 8 },

  startButton:      {
    marginTop: SPACING.xl, backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full, paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
  },
  startButtonText:  { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.lg },

  overlay:          {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  scanFrame:        {
    width: 240, height: 240, borderWidth: 2,
    borderColor: '#fff', borderRadius: RADIUS.md,
  },
  scanHint:         { color: '#fff', marginTop: SPACING.md, fontSize: FONTS.sizes.md },

  captureBar:       {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingBottom: 40, paddingTop: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cancelButton:     { width: 80, alignItems: 'center' },
  cancelText:       { color: '#fff', fontSize: FONTS.sizes.md },
  captureButton:    {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#fff',
  },
  captureInner:     { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff' },

  loadingContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.background, padding: SPACING.xl,
  },
  loadingTitle:     { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary, marginTop: SPACING.lg },
  loadingDesc:      { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginTop: SPACING.sm, textAlign: 'center' },

  resultHeader:     {
    alignItems: 'center', padding: SPACING.xl, paddingTop: SPACING.xl + 16,
    borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg,
  },
  resultIcon:       { fontSize: 56, marginBottom: 8 },
  resultLabel:      { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: '#fff' },
  confidenceBadge:  {
    marginTop: 8, backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 4,
  },
  confidenceText:   { color: '#fff', fontWeight: '700', fontSize: FONTS.sizes.md },
  lixeiraBadge:     {
    marginTop: 6, backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 4,
  },
  lixeiraText:      { color: '#fff', fontSize: FONTS.sizes.sm },

  section:          { margin: SPACING.md, backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md },
  sectionTitle:     { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  instrucaoRow:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  instrucaoBullet:  { color: COLORS.primary, fontWeight: '700', marginRight: 8, fontSize: FONTS.sizes.md },
  instrucaoText:    { flex: 1, color: COLORS.textSecondary, fontSize: FONTS.sizes.md, lineHeight: 22 },

  examplesWrap:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  exampleChip:      {
    borderWidth: 1.5, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  exampleText:      { fontSize: FONTS.sizes.sm, fontWeight: '600' },

  ecoButton:        {
    margin: SPACING.md, borderRadius: RADIUS.full,
    paddingVertical: SPACING.md, alignItems: 'center',
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  ecoButtonText:    { color: '#fff', fontWeight: '800', fontSize: FONTS.sizes.lg },

  resetButton:      {
    marginHorizontal: SPACING.md, borderRadius: RADIUS.full,
    paddingVertical: SPACING.md, alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.primary,
  },
  resetText:        { color: COLORS.primary, fontWeight: '700', fontSize: FONTS.sizes.md },
});
