// =============================================================================
// src/screens/GuiaScreen.js
// BLOCO: Tela de Guia de Separação de Resíduos (Educação Ambiental)
//
// Apresenta informações detalhadas sobre cada categoria de resíduo,
// seguindo as cores e diretrizes da ABNT NBR 10.004 e o programa
// de coleta seletiva definido pelo Ministério do Meio Ambiente.
//
// Alinha-se ao ODS 11 – Cidades e Comunidades Sustentáveis (ONU, 2030).
// =============================================================================

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Animated,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { WASTE_CATEGORIES } from '../classifier';

export default function GuiaScreen() {

  // --------------------------------------------------
  // BLOCO: Estado – controla qual categoria está expandida (acordeão)
  // --------------------------------------------------
  const [expanded, setExpanded] = useState(null);

  const toggle = (key) => setExpanded(prev => prev === key ? null : key);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ---- CABEÇALHO ---------------------------------------------------- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 Guia de Separação</Text>
        <Text style={styles.headerSub}>
          Aprenda a separar corretamente cada tipo de resíduo
          e contribua para um futuro mais sustentável.
        </Text>
      </View>

      {/* ---- INFO ODS ------------------------------------------------------ */}
      <View style={styles.odsCard}>
        <Text style={styles.odsTitle}>🌍 ODS 11 – Agenda 2030 (ONU)</Text>
        <Text style={styles.odsText}>
          Este aplicativo apoia o Objetivo de Desenvolvimento Sustentável 11:
          tornar as cidades e os assentamentos humanos inclusivos, seguros,
          resilientes e sustentáveis.
        </Text>
      </View>

      {/* ---- PADRÃO DE CORES DAS LIXEIRAS --------------------------------- */}
      <Text style={styles.sectionTitle}>Padrão de Cores (ABNT NBR 10.004)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm }}>
        {Object.values(WASTE_CATEGORIES).map(cat => (
          <View key={cat.id} style={[styles.colorCard, { borderTopColor: cat.color }]}>
            <Text style={styles.colorIcon}>{cat.icon}</Text>
            <Text style={[styles.colorLabel, { color: cat.color }]}>{cat.lixeira}</Text>
            <Text style={styles.colorName}>{cat.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ---- LISTA EXPANDÍVEL POR CATEGORIA -------------------------------- */}
      <Text style={styles.sectionTitle}>Detalhes por Categoria</Text>
      {Object.values(WASTE_CATEGORIES).map(cat => (
        <View key={cat.id} style={styles.acordeao}>

          {/* Cabeçalho do item (toque para expandir) */}
          <TouchableOpacity
            style={[styles.acordeaoHeader, { borderLeftColor: cat.color }]}
            onPress={() => toggle(cat.id)}
            activeOpacity={0.8}
          >
            <View style={styles.acordeaoLeft}>
              <Text style={styles.acordeaoIcon}>{cat.icon}</Text>
              <View>
                <Text style={styles.acordeaoTitle}>{cat.label}</Text>
                <Text style={[styles.acordeaoSub, { color: cat.color }]}>
                  Lixeira {cat.lixeira} •{' '}
                  {cat.reciclavel ? '♻️ Reciclável' : '🚫 Não reciclável'}
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>{expanded === cat.id ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {/* Conteúdo expandido */}
          {expanded === cat.id && (
            <View style={styles.acordeaoBody}>

              <Text style={styles.subSectionTitle}>Como descartar:</Text>
              {cat.instrucoes.map((inst, i) => (
                <View key={i} style={styles.instrRow}>
                  <Text style={[styles.instrBullet, { color: cat.color }]}>✓</Text>
                  <Text style={styles.instrText}>{inst}</Text>
                </View>
              ))}

              <Text style={styles.subSectionTitle}>Exemplos:</Text>
              <View style={styles.chipsWrap}>
                {cat.exemplos.map((ex, i) => (
                  <View key={i} style={[styles.chip, { borderColor: cat.color }]}>
                    <Text style={[styles.chipText, { color: cat.color }]}>{ex}</Text>
                  </View>
                ))}
              </View>

            </View>
          )}
        </View>
      ))}

      {/* ---- DICA FINAL ---------------------------------------------------- */}
      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Dica Importante</Text>
        <Text style={styles.tipText}>
          Antes de descartar, sempre limpe as embalagens. Resíduos sujos contaminam
          toda a carga de recicláveis, tornando-os inservíveis. Uma pequena ação
          faz grande diferença!
        </Text>
      </View>

      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
}

// --------------------------------------------------
// BLOCO: Estilos da GuiaScreen
// --------------------------------------------------
const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.background },
  header:       {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 8,
  },
  headerTitle:  { fontSize: FONTS.sizes.xl, fontWeight: '800', color: '#fff' },
  headerSub:    { fontSize: FONTS.sizes.sm, color: '#A5D6A7', marginTop: 4, lineHeight: 20 },

  odsCard:      {
    margin: SPACING.md,
    backgroundColor: '#E3F2FD',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#1565C0',
  },
  odsTitle:     { fontSize: FONTS.sizes.md, fontWeight: '700', color: '#1565C0', marginBottom: 4 },
  odsText:      { fontSize: FONTS.sizes.sm, color: '#1A237E', lineHeight: 20 },

  sectionTitle: {
    fontSize: FONTS.sizes.lg, fontWeight: '700',
    color: COLORS.textPrimary, marginHorizontal: SPACING.md,
    marginTop: SPACING.lg, marginBottom: SPACING.sm,
  },

  colorCard:    {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md,
    marginRight: SPACING.sm, alignItems: 'center', minWidth: 90,
    borderTopWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  colorIcon:    { fontSize: 28, marginBottom: 6 },
  colorLabel:   { fontSize: FONTS.sizes.sm, fontWeight: '700' },
  colorName:    { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2 },

  acordeao:     {
    marginHorizontal: SPACING.md, marginBottom: SPACING.sm,
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
    overflow: 'hidden',
  },
  acordeaoHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.md, borderLeftWidth: 5,
  },
  acordeaoLeft:   { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  acordeaoIcon:   { fontSize: 28 },
  acordeaoTitle:  { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  acordeaoSub:    { fontSize: FONTS.sizes.xs, marginTop: 2 },
  chevron:        { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },

  acordeaoBody:   { padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  subSectionTitle:{ fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6, marginTop: 8 },
  instrRow:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  instrBullet:    { fontWeight: '700', marginRight: 6, fontSize: FONTS.sizes.md },
  instrText:      { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  chipsWrap:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip:           {
    borderWidth: 1.5, borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  chipText:       { fontSize: FONTS.sizes.xs, fontWeight: '600' },

  tipCard:        {
    margin: SPACING.md,
    backgroundColor: COLORS.accentLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  tipTitle:       { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.accent, marginBottom: 4 },
  tipText:        { fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, lineHeight: 20 },
});
