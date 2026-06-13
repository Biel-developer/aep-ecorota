// =============================================================================
// src/screens/PerfilScreen.js
// BLOCO: Tela de Perfil e Histórico do Usuário
//
// Exibe as conquistas do usuário, histórico de descartes e pontuação
// gamificada para incentivar o engajamento cidadão na reciclagem.
//
// A gamificação é uma estratégia reconhecida para aumentar o engajamento
// em aplicativos de sustentabilidade (cf. Santos & Silva, 2022).
// =============================================================================

import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { WASTE_CATEGORIES } from '../classifier';

// --------------------------------------------------
// BLOCO: Dados simulados do usuário
// Em produção, viriam do AsyncStorage (local) ou API de backend
// --------------------------------------------------
const USUARIO = {
  nome:      'Cidadão Verde',
  nivel:     3,
  pontos:    380,
  proximo:   500,
  co2:       '12 kg',
  arvores:   2,
  agua:      '3.200 L',
};

// Histórico de descartes simulado
const HISTORICO = [
  { data: '11/06/2025', categoria: 'plastico', local: 'Ecoponto Central',      pontos: +15 },
  { data: '10/06/2025', categoria: 'papel',    local: 'Ecoponto Parque do Ingá', pontos: +10 },
  { data: '09/06/2025', categoria: 'metal',    local: 'Ecoponto UEM',            pontos: +20 },
  { data: '08/06/2025', categoria: 'vidro',    local: 'Ecoponto Shopping',       pontos: +10 },
  { data: '07/06/2025', categoria: 'organico', local: 'Composteira Comunitária', pontos: +25 },
];

// Conquistas (badges)
const CONQUISTAS = [
  { icon: '🥉', titulo: 'Primeiro Descarte',  descricao: 'Você fez seu primeiro descarte!',   conquistado: true  },
  { icon: '♻️', titulo: 'Reciclador',         descricao: '10 descartes realizados',            conquistado: true  },
  { icon: '🌱', titulo: 'Guardião do Verde',  descricao: '25 descartes realizados',            conquistado: true  },
  { icon: '🏆', titulo: 'Campeão Ecológico',  descricao: '50 descartes — quase lá!',           conquistado: false },
  { icon: '🌍', titulo: 'Herói do Planeta',   descricao: '100 descartes realizados',           conquistado: false },
];

export default function PerfilScreen() {
  // Calcula progresso para o próximo nível (barra de progresso)
  const progresso = USUARIO.pontos / USUARIO.proximo;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ---- CABEÇALHO DO PERFIL ------------------------------------------ */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>🌿</Text>
        </View>
        <Text style={styles.userName}>{USUARIO.nome}</Text>
        <Text style={styles.userLevel}>Nível {USUARIO.nivel} – Reciclador Avançado</Text>

        {/* Barra de progresso de XP */}
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${progresso * 100}%` }]} />
        </View>
        <Text style={styles.xpText}>{USUARIO.pontos} / {USUARIO.proximo} pts para o próximo nível</Text>
      </View>

      {/* ---- IMPACTO AMBIENTAL --------------------------------------------- */}
      <Text style={styles.sectionTitle}>Seu Impacto Ambiental</Text>
      <View style={styles.impactRow}>
        <ImpactCard icon="🌫️" valor={USUARIO.co2}    label="CO₂ evitado"      color="#607D8B" />
        <ImpactCard icon="🌳" valor={USUARIO.arvores} label="Árvores salvas"   color="#2E7D32" />
        <ImpactCard icon="💧" valor={USUARIO.agua}    label="Água economizada" color="#1565C0" />
      </View>

      {/* ---- CONQUISTAS (BADGES) ------------------------------------------- */}
      <Text style={styles.sectionTitle}>Conquistas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm }}>
        {CONQUISTAS.map((c, i) => (
          <View
            key={i}
            style={[styles.badgeCard, !c.conquistado && styles.badgeLocked]}
          >
            <Text style={styles.badgeIcon}>{c.conquistado ? c.icon : '🔒'}</Text>
            <Text style={styles.badgeTitulo}>{c.titulo}</Text>
            <Text style={styles.badgeDesc}>{c.descricao}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ---- HISTÓRICO DE DESCARTES ---------------------------------------- */}
      <Text style={styles.sectionTitle}>Histórico de Descartes</Text>
      {HISTORICO.map((h, i) => {
        const cat = WASTE_CATEGORIES[h.categoria];
        return (
          <View key={i} style={styles.histItem}>
            <View style={[styles.histDot, { backgroundColor: cat.color }]}>
              <Text style={{ fontSize: 14 }}>{cat.icon}</Text>
            </View>
            <View style={styles.histInfo}>
              <Text style={styles.histCategoria}>{cat.label}</Text>
              <Text style={styles.histLocal}>{h.local}</Text>
              <Text style={styles.histData}>{h.data}</Text>
            </View>
            <View style={styles.histPontos}>
              <Text style={styles.histPontosText}>+{h.pontos} pts</Text>
            </View>
          </View>
        );
      })}

      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
}

// --------------------------------------------------
// BLOCO: Sub-componente ImpactCard
// --------------------------------------------------
function ImpactCard({ icon, valor, label, color }) {
  return (
    <View style={[styles.impactCard, { borderTopColor: color }]}>
      <Text style={styles.impactIcon}>{icon}</Text>
      <Text style={[styles.impactValor, { color }]}>{valor}</Text>
      <Text style={styles.impactLabel}>{label}</Text>
    </View>
  );
}

// --------------------------------------------------
// BLOCO: Estilos da PerfilScreen
// --------------------------------------------------
const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.background },
  header:       {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: SPACING.xl + 8,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm,
  },
  avatarText:   { fontSize: 40 },
  userName:     { fontSize: FONTS.sizes.xl, fontWeight: '800', color: '#fff' },
  userLevel:    { fontSize: FONTS.sizes.sm, color: '#A5D6A7', marginTop: 4 },
  xpBar:        {
    height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: RADIUS.full,
    width: '80%', marginTop: SPACING.md, overflow: 'hidden',
  },
  xpFill:       { height: '100%', backgroundColor: COLORS.accent, borderRadius: RADIUS.full },
  xpText:       { fontSize: FONTS.sizes.xs, color: '#C8E6C9', marginTop: 4 },

  sectionTitle: {
    fontSize: FONTS.sizes.lg, fontWeight: '700',
    color: COLORS.textPrimary, marginHorizontal: SPACING.md,
    marginTop: SPACING.lg, marginBottom: SPACING.sm,
  },

  impactRow:    { flexDirection: 'row', marginHorizontal: SPACING.md, gap: SPACING.sm },
  impactCard:   {
    flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    padding: SPACING.md, alignItems: 'center', borderTopWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  impactIcon:   { fontSize: 24, marginBottom: 4 },
  impactValor:  { fontSize: FONTS.sizes.lg, fontWeight: '800' },
  impactLabel:  { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2 },

  badgeCard:    {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md,
    marginRight: SPACING.sm, alignItems: 'center', width: 110,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  badgeLocked:  { opacity: 0.45 },
  badgeIcon:    { fontSize: 32, marginBottom: 6 },
  badgeTitulo:  { fontSize: FONTS.sizes.xs, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  badgeDesc:    { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: 2 },

  histItem:     {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm, borderRadius: RADIUS.md, padding: SPACING.md,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  histDot:      {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  histInfo:     { flex: 1 },
  histCategoria:{ fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  histLocal:    { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  histData:     { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  histPontos:   {
    backgroundColor: COLORS.primaryPale, borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  histPontosText: { color: COLORS.primary, fontWeight: '800', fontSize: FONTS.sizes.sm },
});
