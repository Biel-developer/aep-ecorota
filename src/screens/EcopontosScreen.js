// =============================================================================
// src/screens/EcopontosScreen.js
// BLOCO: Tela de Ecopontos (Pontos de Coleta)
//
// Exibe a lista de pontos de coleta seletiva próximos ao usuário,
// permitindo filtrar por categoria de resíduo.
// Em produção, usaria a API de Geolocalização do Expo e integração
// com Google Maps / OpenStreetMap para rotas em tempo real.
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Linking, Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { ECOPONTOS, filtrarPorCategoria } from '../data/ecopontos';
import { WASTE_CATEGORIES } from '../classifier';

export default function EcopontosScreen({ route }) {
  // --------------------------------------------------
  // BLOCO: Estado – filtro de categoria
  // Recebe categoria inicial via parâmetro de rota (vindo do ScanScreen)
  // --------------------------------------------------
  const categoriaInicial = route?.params?.categoria ?? null;
  const [categoriaFiltro, setCategoriaFiltro] = useState(categoriaInicial);
  const [lista, setLista] = useState(ECOPONTOS);

  // Atualiza a lista quando o filtro muda
  useEffect(() => {
    setLista(categoriaFiltro ? filtrarPorCategoria(categoriaFiltro) : ECOPONTOS);
  }, [categoriaFiltro]);

  // --------------------------------------------------
  // FUNÇÃO: Abre o Google Maps com rota para o ecoponto
  // --------------------------------------------------
  function handleRota(ep) {
    const url = `https://maps.google.com/?daddr=${ep.lat},${ep.lng}&travelmode=driving`;
    Linking.canOpenURL(url)
      .then(ok => ok ? Linking.openURL(url) : Alert.alert('Erro', 'Não foi possível abrir o mapa.'))
      .catch(() => Alert.alert('Erro', 'Não foi possível abrir o mapa.'));
  }

  // --------------------------------------------------
  // BLOCO: Chips de filtro por categoria
  // --------------------------------------------------
  const categorias = [null, ...Object.keys(WASTE_CATEGORIES)];

  return (
    <View style={styles.container}>

      {/* ---- CABEÇALHO ---------------------------------------------------- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 Ecopontos Próximos</Text>
        <Text style={styles.headerSub}>Maringá – PR • {lista.length} local(is) encontrado(s)</Text>
      </View>

      {/* ---- FILTROS POR CATEGORIA ----------------------------------------- */}
      <View style={styles.filterContainer}>
        <FlatList
          data={categorias}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item ?? 'todos'}
          contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm }}
          renderItem={({ item }) => {
            const cat    = item ? WASTE_CATEGORIES[item] : null;
            const active = categoriaFiltro === item;
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  active && { backgroundColor: cat?.color ?? COLORS.primary },
                ]}
                onPress={() => setCategoriaFiltro(item)}
              >
                <Text style={[styles.filterText, active && { color: '#fff' }]}>
                  {cat ? `${cat.icon} ${cat.label}` : '🗺️ Todos'}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* ---- LISTA DE ECOPONTOS ------------------------------------------- */}
      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.md }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>😕</Text>
            <Text style={styles.emptyText}>Nenhum ecoponto encontrado para esta categoria.</Text>
          </View>
        }
        renderItem={({ item: ep }) => (
          <View style={styles.card}>
            {/* Nome e distância */}
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>{ep.nome}</Text>
                <Text style={styles.cardAddress}>{ep.endereco}</Text>
                <Text style={styles.cardAddress}>{ep.cidade}</Text>
              </View>
              <View style={styles.distBadge}>
                <Text style={styles.distText}>{ep.distancia} km</Text>
              </View>
            </View>

            {/* Horário e avaliação */}
            <View style={styles.cardMeta}>
              <Text style={styles.metaItem}>🕐 {ep.horario}</Text>
              <Text style={styles.metaItem}>⭐ {ep.avaliacao}</Text>
            </View>

            {/* Categorias aceitas */}
            <View style={styles.aceiteRow}>
              {ep.aceita.map(cat => (
                <View
                  key={cat}
                  style={[styles.aceiteChip, { backgroundColor: WASTE_CATEGORIES[cat]?.color + '22' }]}
                >
                  <Text style={{ fontSize: 14 }}>{WASTE_CATEGORIES[cat]?.icon}</Text>
                </View>
              ))}
            </View>

            {/* Botão de rota */}
            <TouchableOpacity style={styles.rotaButton} onPress={() => handleRota(ep)}>
              <Text style={styles.rotaText}>🗺️ Como Chegar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// --------------------------------------------------
// BLOCO: Estilos da EcopontosScreen
// --------------------------------------------------
const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.background },
  header:       {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 8,
    paddingBottom: SPACING.lg,
  },
  headerTitle:  { fontSize: FONTS.sizes.xl, fontWeight: '800', color: '#fff' },
  headerSub:    { fontSize: FONTS.sizes.sm, color: '#A5D6A7', marginTop: 2 },

  filterContainer: { backgroundColor: COLORS.card, borderBottomWidth: 1, borderColor: COLORS.border },
  filterChip:   {
    marginRight: 8, paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  filterText:   { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '600' },

  card:         {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.sm,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardTop:      { flexDirection: 'row', alignItems: 'flex-start' },
  cardName:     { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  cardAddress:  { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  distBadge:    {
    backgroundColor: COLORS.primaryPale, borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8,
  },
  distText:     { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '700' },

  cardMeta:     { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm },
  metaItem:     { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },

  aceiteRow:    { flexDirection: 'row', marginTop: SPACING.sm, gap: 6 },
  aceiteChip:   { padding: 6, borderRadius: RADIUS.sm },

  rotaButton:   {
    marginTop: SPACING.sm, backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full, paddingVertical: 10, alignItems: 'center',
  },
  rotaText:     { color: '#fff', fontWeight: '700', fontSize: FONTS.sizes.md },

  empty:        { alignItems: 'center', marginTop: 60 },
  emptyIcon:    { fontSize: 48, marginBottom: 12 },
  emptyText:    { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, textAlign: 'center' },
});
