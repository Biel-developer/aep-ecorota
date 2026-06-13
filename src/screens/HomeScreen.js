// =============================================================================
// src/screens/HomeScreen.js
// BLOCO: Tela Inicial (Dashboard)
//
// Primeira tela que o usuário vê ao abrir o app.
// Exibe boas-vindas, acesso rápido às funcionalidades e dicas de educação
// ambiental, alinhando-se ao ODS 11 da Agenda 2030 da ONU.
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Animated,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

// --------------------------------------------------
// BLOCO: Dados das dicas de educação ambiental
// Exibidas em rotação na tela inicial para engajar o cidadão
// --------------------------------------------------
const DICAS = [
  '♻️  O Brasil recicla apenas 4% do lixo produzido. Você pode mudar isso!',
  '💧  Cada tonelada de papel reciclado poupa 20 árvores e 32 mil litros de água.',
  '🌱  Resíduos orgânicos podem virar adubo — tente a compostagem em casa!',
  '🥤  Uma garrafa PET leva mais de 400 anos para se decompor na natureza.',
  '📦  Separe seu lixo corretamente: você ajuda a gerar emprego e renda.',
];

// --------------------------------------------------
// BLOCO: Atalhos de funcionalidades do app
// Cada atalho leva para uma aba do menu inferior
// --------------------------------------------------
const FEATURES = [
  { icon: '📷', label: 'Escanear\nResíduo',    screen: 'Scan',    bg: COLORS.primaryPale  },
  { icon: '📍', label: 'Ecopontos\nPróximos',   screen: 'Ecopontos', bg: '#FFF3E0'          },
  { icon: '📚', label: 'Guia de\nSeparação',    screen: 'Guia',    bg: '#E3F2FD'            },
  { icon: '🏆', label: 'Meu\nHistórico',         screen: 'Perfil',  bg: '#FCE4EC'           },
];

// --------------------------------------------------
// Componente principal da tela Home
// --------------------------------------------------
export default function HomeScreen({ navigation }) {

  // --------------------------------------------------
  // BLOCO: Estado para rotação das dicas (educação ambiental)
  // --------------------------------------------------
  const [dicaIndex, setDicaIndex] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  // Troca a dica automaticamente a cada 5 segundos com animação de fade
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setDicaIndex(i => (i + 1) % DICAS.length);
        // Fade in
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 5000);
    return () => clearInterval(interval); // Cleanup ao desmontar componente
  }, []);

  // --------------------------------------------------
  // BLOCO: Estatísticas simuladas do usuário
  // Em produção, viriam de um banco de dados local (AsyncStorage) ou API
  // --------------------------------------------------
  const stats = { descartes: 47, pontos: 380, co2: '12kg' };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* ---- CABEÇALHO ---------------------------------------------------- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Cidadão Verde! 👋</Text>
          <Text style={styles.subtitle}>Vamos reciclar hoje?</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>🌿 Nível 3</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

        {/* ---- DICA ROTATIVA (Educação Ambiental) ----------------------------- */}
        <Animated.View style={[styles.dicaCard, { opacity: fadeAnim }]}>
          <Text style={styles.dicaTitle}>💡 Você sabia?</Text>
          <Text style={styles.dicaText}>{DICAS[dicaIndex]}</Text>
          {/* Indicador de página (pontos) */}
          <View style={styles.dicaDots}>
            {DICAS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === dicaIndex && styles.dotActive]}
              />
            ))}
          </View>
        </Animated.View>

        {/* ---- ESTATÍSTICAS DO USUÁRIO -------------------------------------- */}
        <Text style={styles.sectionTitle}>Suas Conquistas</Text>
        <View style={styles.statsRow}>
          <StatCard icon="♻️" value={stats.descartes} label="Descartes" />
          <StatCard icon="⭐" value={stats.pontos}    label="Pontos"    />
          <StatCard icon="🌳" value={stats.co2}       label="CO₂ evitado" />
        </View>

        {/* ---- BOTÃO PRINCIPAL: ESCANEAR ------------------------------------- */}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => navigation.navigate('Scan')}
          activeOpacity={0.85}
        >
          <Text style={styles.mainButtonIcon}>📷</Text>
          <View>
            <Text style={styles.mainButtonTitle}>Identificar Resíduo</Text>
            <Text style={styles.mainButtonSub}>Use a câmera para classificar o lixo</Text>
          </View>
        </TouchableOpacity>

        {/* ---- ATALHOS DE FUNCIONALIDADES ------------------------------------ */}
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <View style={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <TouchableOpacity
              key={f.screen}
              style={[styles.featureCard, { backgroundColor: f.bg }]}
              onPress={() => navigation.navigate(f.screen)}
              activeOpacity={0.8}
            >
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

// --------------------------------------------------
// BLOCO: Sub-componente StatCard (cartão de estatística)
// --------------------------------------------------
function StatCard({ icon, value, label }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// --------------------------------------------------
// BLOCO: Estilos da HomeScreen via StyleSheet
// StyleSheet.create() otimiza a renderização no React Native
// --------------------------------------------------
const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: COLORS.background },
  header:          {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop:  SPACING.xl + 8,
    paddingBottom: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting:        { fontSize: FONTS.sizes.xl, color: COLORS.white, fontWeight: 'bold' },
  subtitle:        { fontSize: FONTS.sizes.md, color: '#A5D6A7', marginTop: 2 },
  headerBadge:     { backgroundColor: '#43A047', paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full },
  headerBadgeText: { color: COLORS.white, fontSize: FONTS.sizes.sm, fontWeight: '700' },

  dicaCard: {
    margin: SPACING.md,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.accentLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  dicaTitle: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.accent, marginBottom: 4 },
  dicaText:  { fontSize: FONTS.sizes.md, color: COLORS.textPrimary, lineHeight: 22 },
  dicaDots:  { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.sm },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFCC80', marginHorizontal: 3 },
  dotActive: { backgroundColor: COLORS.accent, width: 16 },

  sectionTitle: {
    fontSize: FONTS.sizes.lg, fontWeight: '700',
    color: COLORS.textPrimary, marginHorizontal: SPACING.md,
    marginTop: SPACING.lg, marginBottom: SPACING.sm,
  },
  statsRow:  { flexDirection: 'row', marginHorizontal: SPACING.md, gap: SPACING.sm },
  statCard:  {
    flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    padding: SPACING.md, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  statIcon:  { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, textAlign: 'center' },

  mainButton: {
    margin: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  mainButtonIcon:  { fontSize: 36 },
  mainButtonTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.white },
  mainButtonSub:   { fontSize: FONTS.sizes.sm, color: '#A5D6A7', marginTop: 2 },

  featuresGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    marginHorizontal: SPACING.md, gap: SPACING.sm,
  },
  featureCard:  {
    width: '47.5%', borderRadius: RADIUS.md, padding: SPACING.md,
    alignItems: 'center', justifyContent: 'center', aspectRatio: 1.4,
  },
  featureIcon:  { fontSize: 30, marginBottom: 6 },
  featureLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'center' },
});
