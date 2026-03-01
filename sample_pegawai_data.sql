INSERT INTO public."Pegawai" ("nipPegawai", nama, "gelarDepan", "gelarBelakang", "tempatLahir", "tanggalLahir", "jenisKelamin", agama, alamat, email, "noHp", foto)
VALUES
('198765432100000001', 'Budi Santoso', NULL, 'S.Kom', 'Samarinda', '1990-05-12', 'Laki-laki', 'Islam', 'Jl. Merdeka No.1', 'budi@example.test', '081234567890', 'budi.jpg'),
('198765432100000002', 'Siti Aminah', NULL, NULL, 'Balikpapan', '1988-11-02', 'Perempuan', 'Kristen', 'Jl. Pahlawan No.2', 'siti@example.test', '089876543210', 'siti.jpg'),
('198765432100000003', 'Andi Pratama', 'Drs.', NULL, 'Tenggarong', '1985-01-21', 'Laki-laki', 'Islam', 'Jl. Nusantara No.7', 'andi@example.test', '081122334455', 'andi.jpg')
ON CONFLICT ("nipPegawai") DO UPDATE SET
  nama = EXCLUDED.nama,
  "gelarDepan" = EXCLUDED."gelarDepan",
  "gelarBelakang" = EXCLUDED."gelarBelakang",
  "tempatLahir" = EXCLUDED."tempatLahir",
  "tanggalLahir" = EXCLUDED."tanggalLahir",
  "jenisKelamin" = EXCLUDED."jenisKelamin",
  agama = EXCLUDED.agama,
  alamat = EXCLUDED.alamat,
  email = EXCLUDED.email,
  "noHp" = EXCLUDED."noHp",
  foto = EXCLUDED.foto;

INSERT INTO public."IdentitasResmi" ("nipIdResmi", nik, "noBpjs", "noNpwp", karpeg, "karsuKarsi", taspen)
VALUES
('198765432100000001', '6471011205900001', '000111222333', '12.345.678.9-001.000', 'KARPEG001', 'KARSU001', 'TASPEN001'),
('198765432100000002', '6471010211880002', '000111222334', '12.345.678.9-002.000', 'KARPEG002', 'KARSI002', 'TASPEN002'),
('198765432100000003', '6471012101850003', '000111222335', '12.345.678.9-003.000', 'KARPEG003', 'KARSU003', 'TASPEN003')
ON CONFLICT ("nipIdResmi") DO UPDATE SET
  nik = EXCLUDED.nik,
  "noBpjs" = EXCLUDED."noBpjs",
  "noNpwp" = EXCLUDED."noNpwp",
  karpeg = EXCLUDED.karpeg,
  "karsuKarsi" = EXCLUDED."karsuKarsi",
  taspen = EXCLUDED.taspen;

INSERT INTO public."Kepegawaian" ("nipKepegawaian", "statusPegawai", "jenisPegawai", "tmtCpns", "tmtPns", "masaKerjaTahun", "masaKerjaBulan")
VALUES
('198765432100000001', 'PNS', 'Struktural', '2014-03-01', '2016-04-01', 11, 0),
('198765432100000002', 'PNS', 'Fungsional', '2012-06-15', '2014-07-15', 13, 8),
('198765432100000003', 'PNS', 'Struktural', '2010-01-01', '2012-02-01', 16, 1)
ON CONFLICT ("nipKepegawaian") DO UPDATE SET
  "statusPegawai" = EXCLUDED."statusPegawai",
  "jenisPegawai" = EXCLUDED."jenisPegawai",
  "tmtCpns" = EXCLUDED."tmtCpns",
  "tmtPns" = EXCLUDED."tmtPns",
  "masaKerjaTahun" = EXCLUDED."masaKerjaTahun",
  "masaKerjaBulan" = EXCLUDED."masaKerjaBulan";

INSERT INTO public."Pangkat" ("idPangkat", pangkat, golongan, ruang, urutan)
VALUES
(1, 'Penata Muda', 'III/a', 'a', 1),
(2, 'Penata Muda Tk.I', 'III/b', 'b', 2),
(3, 'Penata', 'III/c', 'c', 3)
ON CONFLICT ("idPangkat") DO UPDATE SET
  pangkat = EXCLUDED.pangkat,
  golongan = EXCLUDED.golongan,
  ruang = EXCLUDED.ruang,
  urutan = EXCLUDED.urutan;

SELECT setval(pg_get_serial_sequence('public."Pangkat"','idPangkat'), GREATEST((SELECT MAX("idPangkat") FROM public."Pangkat"),1), true);

INSERT INTO public."RiwayatPangkat" ("nipRiwayat", "idPangkatRiwayat", "tmtPangkat", "tmtSelesai", status)
VALUES
('198765432100000001', 2, '2022-01-01', NULL, true),
('198765432100000002', 3, '2021-07-01', NULL, true),
('198765432100000003', 1, '2020-05-01', NULL, true)
ON CONFLICT DO NOTHING;
