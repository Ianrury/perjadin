import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

 
  const hashedPassword = await bcrypt.hash("password123", 10);

  
  console.log("Creating users...");
  
  const pegawai1 = await prisma.user.upsert({
    where: { username: "walter" },
    update: {},
    create: {
      username: "walter",
      password: hashedPassword,
      nama: "Walter White",
      role: "PEGAWAI",
    },
  });

  const pegawai2 = await prisma.user.upsert({
    where: { username: "jesse" },
    update: {},
    create: {
      username: "jesse",
      password: hashedPassword,
      nama: "Jesse Pinkman",
      role: "PEGAWAI",
    },
  });

  const sdm = await prisma.user.upsert({
    where: { username: "janedoe" },
    update: {},
    create: {
      username: "janedoe",
      password: hashedPassword,
      nama: "Jane Doe",
      role: "DIVISI_SDM",
    },
  });

  console.log("✅ Users created");

  console.log("Creating kota master data...");

  const kotaData = [
    {
      namaKota: "Bandung",
      latitude: -6.917500,
      longitude: 107.619100,
      provinsi: "Jawa Barat",
      pulau: "Jawa",
      luarNegeri: false,
    },
    {
      namaKota: "Surabaya",
      latitude: -7.250445,
      longitude: 112.768845,
      provinsi: "Jawa Timur",
      pulau: "Jawa",
      luarNegeri: false,
    },
    {
      namaKota: "Jakarta",
      latitude: -6.208763,
      longitude: 106.845599,
      provinsi: "DKI Jakarta",
      pulau: "Jawa",
      luarNegeri: false,
    },
    {
      namaKota: "Yogyakarta",
      latitude: -7.797068,
      longitude: 110.370529,
      provinsi: "DI Yogyakarta",
      pulau: "Jawa",
      luarNegeri: false,
    },
    {
      namaKota: "Semarang",
      latitude: -6.966667,
      longitude: 110.416664,
      provinsi: "Jawa Tengah",
      pulau: "Jawa",
      luarNegeri: false,
    },
    {
      namaKota: "Lampung",
      latitude: -5.429222,
      longitude: 105.262772,
      provinsi: "Lampung",
      pulau: "Sumatera",
      luarNegeri: false,
    },
    {
      namaKota: "Medan",
      latitude: 3.595196,
      longitude: 98.672226,
      provinsi: "Sumatera Utara",
      pulau: "Sumatera",
      luarNegeri: false,
    },
    {
      namaKota: "Denpasar",
      latitude: -8.670458,
      longitude: 115.212631,
      provinsi: "Bali",
      pulau: "Bali",
      luarNegeri: false,
    },
    {
      namaKota: "Makassar",
      latitude: -5.147665,
      longitude: 119.432732,
      provinsi: "Sulawesi Selatan",
      pulau: "Sulawesi",
      luarNegeri: false,
    },
    {
      namaKota: "Pontianak",
      latitude: -0.026353,
      longitude: 109.342003,
      provinsi: "Kalimantan Barat",
      pulau: "Kalimantan",
      luarNegeri: false,
    },
    {
      namaKota: "Singapore",
      latitude: 1.352083,
      longitude: 103.819836,
      provinsi: "Singapore",
      pulau: "Singapore",
      luarNegeri: true,
    },
    {
      namaKota: "Kuala Lumpur",
      latitude: 3.139003,
      longitude: 101.686855,
      provinsi: "Federal Territory",
      pulau: "Malaysia",
      luarNegeri: true,
    },
  ];

  for (const kota of kotaData) {
    await prisma.kota.upsert({
      where: { namaKota: kota.namaKota },
      update: {},
      create: kota,
    });
  }

  console.log("✅ Kota master data created");

  console.log("Creating sample perdin...");

  const bandung = await prisma.kota.findFirst({ where: { namaKota: "Bandung" } });
  const surabaya = await prisma.kota.findFirst({ where: { namaKota: "Surabaya" } });
  const lampung = await prisma.kota.findFirst({ where: { namaKota: "Lampung" } });
  const jakarta = await prisma.kota.findFirst({ where: { namaKota: "Jakarta" } });

  if (bandung && surabaya) {
    await prisma.perdin.create({
      data: {
        pegawaiId: pegawai1.id,
        kotaAsalId: bandung.id,
        kotaTujuanId: surabaya.id,
        tanggalBerangkat: new Date("2022-09-28"),
        tanggalPulang: new Date("2022-10-09"),
        durasiHari: 12,
        keterangan: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A id nec ut eros nunc congue. Eget eget quisque cursus.",
        jarakKm: 781,
        uangSakuPerHari: 250000,
        totalUangPerdin: 3000000,
        currencyCode: "IDR",
        status: "PENDING",
      },
    });
  }

  if (lampung && jakarta) {
    await prisma.perdin.create({
      data: {
        pegawaiId: pegawai2.id,
        kotaAsalId: lampung.id,
        kotaTujuanId: jakarta.id,
        tanggalBerangkat: new Date("2022-10-11"),
        tanggalPulang: new Date("2022-11-11"),
        durasiHari: 32,
        keterangan: "A id nec ut eros nunc congue. Eget eget quisque risus cursus.",
        jarakKm: 165,
        uangSakuPerHari: 250000,
        totalUangPerdin: 8000000,
        currencyCode: "IDR",
        status: "PENDING",
      },
    });
  }

  console.log("✅ Sample perdin created");

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });