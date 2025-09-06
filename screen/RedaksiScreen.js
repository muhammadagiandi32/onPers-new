// screens/RedaksiScreen.jsx
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RedaksiScreen() {
  // --- Data (silakan sesuaikan bila ada perbedaan) ---
  const data = {
    pimpinan: ["Agus Mansur"],
    redaksi: ["Munib Anshori"],
    developerIT: ["Muhammad Agiandi", "Firman Saputra"],
    supporting: ["Muhammad Lukman Hakim"],
    produk: [
      "Public relations (PR)",
      "Event Organizer (EO)",
      "Developer IT (Web dan Aplikasi)",
    ],
    legal: {
      perusahaan: "PT. Barokah Onpers Sejahtera",
      nib: "0506240073939", // ← dari dokumen NIB
      skalaUsaha: "Usaha Kecil", // ← dari dokumen
      alamat1: "Menara 165 Lt.14 Unit E",
      alamat2: "Jl. TB Simatupang No. Kav. 1 Cilandak Timur, Pasar Minggu",
      alamat3: "Jakarta Selatan 12560",
      telp: "081322258387",
      email: "onpers.devlopment@gmail.com",
      diterbitkan: "Jakarta, 5 Juni 2024",
      dicetak: "5 Juni 2024",
      nibUrl: null, // contoh: "https://onpers.co.id/legal/nib.pdf" (opsional)
    },
    kontak: {
      email: "onpers.devlopment@gmail.com",
      telepon: "+62-21-1234567",
      whatsapp: "+62 813-2225-8387",
      website: "https://onpers.com",
    },
  };

  // --- Helpers ---
  const sanitizeForTel = (num) => (num || "").replace(/[^+\d]/g, "");
  const normalizeForWa = (num) => {
    const digits = (num || "").replace(/[^\d]/g, "");
    if (digits.startsWith("62")) return digits;
    if (digits.startsWith("0")) return "62" + digits.slice(1);
    return digits;
  };

  const openEmail = (mail) => Linking.openURL(`mailto:${mail}`);
  const openPhone = (num) => Linking.openURL(`tel:${sanitizeForTel(num)}`);
  const openWeb = (url) => Linking.openURL(url);
  const openWhatsApp = async (num) => {
    const phone = normalizeForWa(num);
    const scheme = `whatsapp://send?phone=${phone}`;
    const web = `https://wa.me/${phone}`;
    try {
      const supported = await Linking.canOpenURL(scheme);
      if (supported) return Linking.openURL(scheme);
      return Linking.openURL(web);
    } catch {
      Alert.alert(
        "Tidak bisa membuka WhatsApp",
        "Pastikan aplikasi WhatsApp terpasang."
      );
    }
  };

  const Section = ({ title, icon, accent, children }) => (
    <View style={styles.card}>
      <View style={[styles.cardHeader, { backgroundColor: accent }]}>
        <Ionicons
          name={icon}
          size={18}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.cardHeaderText}>{title}</Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );

  const Row = ({ children }) => <Text style={styles.rowText}>{children}</Text>;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Redaksi & Penulis</Text>

        <Section title="Pimpinan Perusahaan" icon="person" accent="#1678F3">
          {data.pimpinan.map((n) => (
            <Row key={n}>{n}</Row>
          ))}
        </Section>

        <Section title="Redaksi" icon="newspaper-outline" accent="#12A0B4">
          {data.redaksi.map((n) => (
            <Row key={n}>{n}</Row>
          ))}
        </Section>

        <Section title="Developer IT" icon="laptop-outline" accent="#22A447">
          {data.developerIT.map((n) => (
            <Row key={n}>{n}</Row>
          ))}
        </Section>

        <Section
          title="Supporting Bisnis"
          icon="briefcase-outline"
          accent="#FFBA08"
        >
          {data.supporting.map((n) => (
            <Row key={n}>{n}</Row>
          ))}
        </Section>

        <Section
          title="Produk Bisnis"
          icon="pricetags-outline"
          accent="#343A40"
        >
          {data.produk.map((p) => (
            <Row key={p}>
              {"\u2713"} {p}
            </Row>
          ))}
        </Section>

        {/* === LEGALITAS + NIB (bagian penting dari dokumen) === */}
        <Section
          title="Legalitas Perusahaan"
          icon="shield-checkmark-outline"
          accent="#6C757D"
        >
          <Row>{data.legal.perusahaan}</Row>
          <Row>NIB: {data.legal.nib}</Row>
          <Row>Skala Usaha: {data.legal.skalaUsaha}</Row>
          <Row>{data.legal.alamat1}</Row>
          <Row>{data.legal.alamat2}</Row>
          <Row>{data.legal.alamat3}</Row>

          {/* Kontak dari dokumen NIB */}
          <TouchableOpacity onPress={() => openPhone(data.legal.telp)}>
            <Row>
              <Ionicons name="call-outline" size={14} color="#444" /> Telp:{" "}
              {data.legal.telp}
            </Row>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openEmail(data.legal.email)}>
            <Row>
              <Ionicons name="mail-outline" size={14} color="#444" /> Email:{" "}
              {data.legal.email}
            </Row>
          </TouchableOpacity>

          <Row>Diterbitkan: {data.legal.diterbitkan}</Row>
          <Row>Dicetak: {data.legal.dicetak}</Row>

          {/* Tautan NIB PDF (opsional) */}
          {data.legal.nibUrl ? (
            <TouchableOpacity onPress={() => openWeb(data.legal.nibUrl)}>
              <Row>
                <Ionicons name="document-text-outline" size={14} color="#444" />{" "}
                Lihat NIB (PDF)
              </Row>
            </TouchableOpacity>
          ) : null}
        </Section>

        <Section title="Kontak" icon="call-outline" accent="#8A2BE2">
          <TouchableOpacity onPress={() => openEmail(data.kontak.email)}>
            <Row>
              <Ionicons name="mail-outline" size={14} color="#444" /> Email:{" "}
              {data.kontak.email}
            </Row>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPhone(data.kontak.telepon)}>
            <Row>
              <Ionicons name="call-outline" size={14} color="#444" /> Telepon:{" "}
              {data.kontak.telepon}
            </Row>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openWhatsApp(data.kontak.whatsapp)}>
            <Row>
              <Ionicons name="logo-whatsapp" size={14} color="#25D366" />{" "}
              WhatsApp: {data.kontak.whatsapp}
            </Row>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openWeb(data.kontak.website)}>
            <Row>
              <Ionicons name="globe-outline" size={14} color="#444" /> Website:{" "}
              {data.kontak.website}
            </Row>
          </TouchableOpacity>
        </Section>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F7F9" },
  container: { padding: 16 },
  pageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cardHeaderText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  cardBody: { paddingHorizontal: 12, paddingVertical: 10 },
  rowText: { fontSize: 14, color: "#1B1C1D", marginBottom: 6 },
});
