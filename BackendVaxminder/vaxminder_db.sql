-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2026
-- Server version: 10.4.32-MariaDB

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vaxminder_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `alertas`
--

CREATE TABLE `alertas` (
  `idalerta` int(11) NOT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `fechaalerta` date NOT NULL,
  `fechaenvio` datetime(6) DEFAULT NULL,
  `mensaje` text NOT NULL,
  `tipoalerta` varchar(255) NOT NULL,
  `idregistro` int(11) DEFAULT NULL,
  `idusuario` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alertas`
--

INSERT INTO `alertas` (`idalerta`, `estado`, `fechaalerta`, `fechaenvio`, `mensaje`, `tipoalerta`, `idregistro`, `idusuario`) VALUES
(1, 'pendiente', '2026-06-15', NULL, 'Proxima dosis de COVID-19 Bivalente programada para el 2026-06-15', 'proximadosis', 1, '1001234567'),
(2, 'pendiente', '2025-03-10', NULL, 'Proxima dosis de Influenza programada para el 2025-03-10', 'proximadosis', 2, '1002345678'),
(3, 'pendiente', '2025-02-05', NULL, 'Proxima dosis de VPH Bivalente programada para el 2025-02-05', 'proximadosis', 3, '1003456789'),
(4, 'pendiente', '2034-05-18', NULL, 'Proxima dosis de Tetanos Td programada para el 2034-05-18', 'proximadosis', 4, '1004567890'),
(5, 'pendiente', '2025-06-20', NULL, 'Proxima dosis de Hepatitis B programada para el 2025-06-20', 'proximadosis', 5, '1005678901'),
(6, 'pendiente', '2025-06-20', NULL, 'Proxima dosis de Hepatitis B programada para el 2025-06-20', 'proximadosis', 6, '1005678901'),
(7, 'pendiente', '2033-11-10', NULL, 'Proxima dosis de Fiebre Amarilla programada para el 2033-11-10', 'proximadosis', 7, '1006789012'),
(8, 'pendiente', '2025-02-28', NULL, 'Proxima dosis de COVID-19 Bivalente programada para el 2025-02-28', 'proximadosis', 8, '1007890123'),
(9, 'pendiente', '2025-04-05', NULL, 'Proxima dosis de Influenza programada para el 2025-04-05', 'proximadosis', 9, '1008901234'),
(10, 'pendiente', '2025-07-12', NULL, 'Proxima dosis de Hepatitis B programada para el 2025-07-12', 'proximadosis', 10, '1009012345'),
(11, 'pendiente', '2034-09-30', NULL, 'Proxima dosis de Tetanos Td programada para el 2034-09-30', 'proximadosis', 11, '1010123456'),
(12, 'pendiente', '2024-06-15', NULL, 'Proxima dosis de COVID-19 Bivalente programada para el 2024-06-15', 'proximadosis', 12, '1001234567'),
(13, 'pendiente', '2025-11-10', NULL, 'Proxima dosis de Influenza programada para el 2025-11-10', 'proximadosis', 13, '1001234567');

-- --------------------------------------------------------

--
-- Table structure for table `centrosmedicos`
--

CREATE TABLE `centrosmedicos` (
  `idcentro` int(11) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `nombrecentro` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `tipocentro` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `centrosmedicos`
--

INSERT INTO `centrosmedicos` (`idcentro`, `ciudad`, `direccion`, `nombrecentro`, `telefono`, `tipocentro`) VALUES
(1, 'Medellin', 'Calle 64 No 51D154', 'Hospital San Vicente Fundacion', '6044446000', 'Hospital'),
(2, 'Medellin', 'Diagonal 75B No 2A80', 'Clinica Las Americas', '6046060666', 'Clinica'),
(3, 'Bello', 'Carrera 50 No 3610', 'IPS Comfama Bello', '6046048080', 'IPS'),
(4, 'Itagui', 'Carrera 52 No 4720', 'Unidad de Vacunacion Itagui', '6042770000', 'Centro de Vacunacion'),
(5, 'Medellin', 'Calle 24 No 4830', 'Hospital General de Medellin', '6043810000', 'Hospital'),
(6, 'Medellin', 'Calle 51 No 4593', 'Clinica Soma', '6046049191', 'Clinica'),
(7, 'Medellin', 'Carrera 43A No 150', 'IPS Sura Centro', '6044441444', 'IPS'),
(8, 'Envigado', 'Calle 38 Sur No 4313', 'Puesto de Salud Envigado', '6043390000', 'Puesto de Salud'),
(9, 'Medellin', 'Carrera 80 No 48B80', 'Clinica Leon XIII', '6044508080', 'Clinica'),
(10, 'Medellin', 'Calle 78B No 69240', 'Centro Salud Pablo Tobon Uribe', '6044459595', 'Hospital');

-- --------------------------------------------------------

--
-- Table structure for table `historialpdf`
--

CREATE TABLE `historialpdf` (
  `idhistorial` int(11) NOT NULL,
  `fechageneracion` datetime(6) DEFAULT NULL,
  `nombrearchivo` varchar(255) NOT NULL,
  `rutaarchivo` varchar(255) NOT NULL,
  `idusuario` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `historialpdf`
--

INSERT INTO `historialpdf` (`idhistorial`, `fechageneracion`, `nombrearchivo`, `rutaarchivo`, `idusuario`) VALUES
(1, '2026-04-29 16:54:42.000000', 'carnet_1001234567_2026-04-29.pdf', '/pdf/carnet_1001234567_2026-04-29.pdf', '1001234567');

-- --------------------------------------------------------

--
-- Table structure for table `registrovacunacion`
--

CREATE TABLE `registrovacunacion` (
  `idregistro` int(11) NOT NULL,
  `fechaaplicacion` date NOT NULL,
  `lotevacuna` varchar(255) DEFAULT NULL,
  `numerodosis` int(11) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `proximadosisfecha` date DEFAULT NULL,
  `idcentromedico` int(11) DEFAULT NULL,
  `idusuario` varchar(20) NOT NULL,
  `idvacuna` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registrovacunacion`
--

INSERT INTO `registrovacunacion` (`idregistro`, `fechaaplicacion`, `lotevacuna`, `numerodosis`, `observaciones`, `proximadosisfecha`, `idcentromedico`, `idusuario`, `idvacuna`) VALUES
(1, '2024-01-15', 'LOT2024COV001', 1, 'Sin reacciones adversas', '2026-06-15', 1, '1001234567', 1),
(2, '2024-03-10', 'LOT2024FLU033', 1, 'Sin novedades', '2025-03-10', 2, '1002345678', 2),
(3, '2024-08-05', 'LOT2024VPH007', 1, 'Primera dosis VPH', '2025-02-05', 4, '1003456789', 7),
(4, '2024-05-18', 'LOT2024TET022', 1, 'Refuerzo de tetanos', '2034-05-18', 5, '1004567890', 10),
(5, '2024-06-20', 'LOT2024HEP015', 1, 'Primera dosis Hepatitis B', '2025-06-20', 3, '1005678901', 4),
(6, '2024-06-20', 'LOT2024HEP015', 1, 'Primera dosis Hepatitis B', '2025-06-20', 3, '1005678901', 4),
(7, '2023-11-10', 'LOT2023FA009', 1, 'Viaje internacional', '2033-11-10', 6, '1006789012', 8),
(8, '2024-02-28', 'LOT2024COV044', 2, 'Segunda dosis COVID', '2025-02-28', 7, '1007890123', 1),
(9, '2024-04-05', 'LOT2024FLU055', 1, 'Sin novedades', '2025-04-05', 8, '1008901234', 2),
(10, '2024-07-12', 'LOT2024HEP031', 1, 'Inicio esquema Hep B', '2025-07-12', 9, '1009012345', 4),
(11, '2024-09-30', 'LOT2024TET088', 1, 'Control anual', '2034-09-30', 10, '1010123456', 10),
(12, '2024-06-15', 'LOT2024COV002', 1, 'Segunda dosis completada sin novedad', '2024-06-15', 2, '1001234567', 1),
(13, '2024-11-10', 'LOT2024COV099', 2, 'Prueba de seguridad', '2025-11-10', 3, '1001234567', 2);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `idusuario` varchar(20) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fechanacimiento` date NOT NULL,
  `fecharegistro` datetime(6) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `rol` varchar(20) NOT NULL DEFAULT 'usuario',
  `telefono` varchar(255) DEFAULT NULL,
  `tipodocumento` varchar(10) NOT NULL DEFAULT 'CC',
  `tiposangre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`idusuario`, `apellido`, `contrasena`, `email`, `fechanacimiento`, `fecharegistro`, `nombre`, `rol`, `telefono`, `tipodocumento`, `tiposangre`) VALUES
('1001234567', 'Torres Restrepo', '$2a$10$mAeJ.WwagG2XFukJhZHl.eg4rD1ZgJFVJyYuY8DXb90qm5LqddzNS', 'camila@email.com', '1998-03-15', '2026-04-29 15:36:03.000000', 'Camila', 'usuario', '3001234567', 'CC', 'O+'),
('1002345678', 'Gomez Hurtado', '$2a$10$6tO1rq7LkS.faKaYId/erOjyC32uRyfXuERBCoXBLU3T4srxFxBIe', 'andres@email.com', '1995-07-22', '2026-04-29 15:36:32.000000', 'Andres', 'usuario', '3112345678', 'CC', 'A+'),
('1003456789', 'Cardona Lopez', '$2a$10$x/2YYNDNHj7Lz3EnOorEiuqZfwgiPWF5FvVs0uA5leW1SRw02ObeO', 'valentina@email.com', '2001-11-08', '2026-04-29 15:36:44.000000', 'Valentina', 'usuario', '3223456789', 'CC', 'B+'),
('1004567890', 'Arango Velez', '$2a$10$GUDKr6ZYaVZYo1uC6kDlx.Xj44Q/0PideIA5iEE5TaGadV95jteLu', 'sebastian@email.com', '1990-05-30', '2026-04-29 15:37:01.000000', 'Sebastian', 'usuario', '3004567890', 'CC', 'AB+'),
('1005678901', 'Rios Zapata', '$2a$10$ZCntFoldCCvuIKKqHAjjNuxTpmNysi/XAh33bORYV4WtVw7zL7v4S', 'mariana@email.com', '2003-09-14', '2026-04-29 15:37:25.000000', 'Mariana', 'usuario', '3105678901', 'CC', 'O-'),
('1006789012', 'Morales Diaz', '$2a$10$V3nx9Y1ZLqghtwDPXp5Xj.hXFZPlpt6ki/mZMu56ooWzv.VUkt3Vm', 'felipe@email.com', '1985-12-01', '2026-04-29 15:37:37.000000', 'Felipe', 'usuario', '3206789012', 'CC', 'A-'),
('1007890123', 'Jimenez Ospina', '$2a$10$/lvZp7t4MEnfRlNiaYLYDOWG4uzvo.umK7qpWwTTUbx1LqqMJbQWO', 'laura@email.com', '2000-04-20', '2026-04-29 15:37:50.000000', 'Laura', 'usuario', '3007890123', 'CC', 'B-'),
('1008901234', 'Perez Montoya', '$2a$10$oz5BpUZfoTc5Q7mFE43suOlotyks3UtFNalNIhkgU.jzOSApkox1K', 'carlos@email.com', '1992-08-17', '2026-04-29 15:38:04.000000', 'Carlos', 'usuario', '3108901234', 'CC', 'AB-'),
('1009012345', 'Castro Vargas', '$2a$10$ZAukaxRMY2McO4yOiqATg.QE6GyR/l/5nejm181tcQid6IvGtN5bm', 'sofia@email.com', '1997-06-25', '2026-04-29 15:38:15.000000', 'Sofia', 'usuario', '3009012345', 'CC', 'O+'),
('1010123456', 'Ramirez Cano', '$2a$10$4WE4Dvv4lGGVM.mJKuDXwOiRgx1MMHx.s.FyLcDJ6t0yKEGGC4cky', 'daniel@email.com', '1988-02-10', '2026-04-29 15:38:28.000000', 'Daniel', 'usuario', '3210123456', 'CC', 'A+'),
('1038134116', 'Mestra', '$2a$10$yYIy0Q7z.woCePe9LXCrbOLNidi/SVAzinTlutGwvnpUvZUkQHWvu', 'carlosm@mail.com', '2010-12-09', '2026-04-29 20:38:53.000000', 'Carlos', 'usuario', '3136657604', 'TI', 'O+'),
('1192742853', 'Mestra', '$2a$10$PpzmjV3wpvtKM10ghHO3ues3OTwMGZQmArVLlZViKGQlU4Zb2HE4q', 'ammestra3@hotmail.com', '1999-07-09', '2026-04-29 17:00:37.000000', 'Anna', 'usuario', '3008121497', 'CC', 'A+'),
-- Nota: El usuario admin CMED01 es creado automaticamente por DataInitializer.java al arrancar el backend

-- --------------------------------------------------------

--
-- Table structure for table `vacunascatalogo`
--

CREATE TABLE `vacunascatalogo` (
  `idvacuna` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `dosisrequeridas` int(11) NOT NULL,
  `edadrecomendada` int(11) DEFAULT NULL,
  `intervalodosisdias` int(11) DEFAULT NULL,
  `nombrevacuna` varchar(255) NOT NULL,
  `requiererefuerzo` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vacunascatalogo`
-- edadrecomendada = edad minima en meses para aplicar la vacuna (NULL = todas las edades)
--

INSERT INTO `vacunascatalogo` (`idvacuna`, `descripcion`, `dosisrequeridas`, `edadrecomendada`, `intervalodosisdias`, `nombrevacuna`, `requiererefuerzo`) VALUES
(1, 'Vacuna bivalente contra COVID-19', 2, 216, 21, 'COVID-19 Bivalente', b'1'),
(2, 'Vacuna trivalente contra la gripe estacional', 1, NULL, 365, 'Influenza', b'1'),
(3, 'Sarampion Paperas y Rubeola', 2, 0, 30, 'Triple Viral MMR', b'0'),
(4, 'Vacuna contra el virus de la Hepatitis B', 3, NULL, 30, 'Hepatitis B', b'0'),
(5, 'Difteria Pertosis y Tetanos', 5, 0, 60, 'DPT Pentavalente', b'0'),
(6, 'Vacuna oral contra la Poliomielitis', 4, 0, 60, 'Polio VOP', b'0'),
(7, 'Virus del Papiloma Humano', 2, 108, 180, 'VPH Bivalente', b'0'),
(8, 'Obligatoria para viajes internacionales', 1, 216, 3650, 'Fiebre Amarilla', b'1'),
(9, 'Contra diarreas graves en bebes', 3, 0, 30, 'Rotavirus', b'0'),
(10, 'Refuerzo de Tetanos para adultos', 1, 216, 3650, 'Tetanos Td', b'1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alertas`
--
ALTER TABLE `alertas`
  ADD PRIMARY KEY (`idalerta`),
  ADD KEY `FKb0wfdadn9ragyyum6s7xt2vg3` (`idregistro`),
  ADD KEY `FKqfe4b9xikh69rh9y38ws7k3du` (`idusuario`);

--
-- Indexes for table `centrosmedicos`
--
ALTER TABLE `centrosmedicos`
  ADD PRIMARY KEY (`idcentro`);

--
-- Indexes for table `historialpdf`
--
ALTER TABLE `historialpdf`
  ADD PRIMARY KEY (`idhistorial`),
  ADD KEY `FKlbns3t94tessf4593ia9v1o18` (`idusuario`);

--
-- Indexes for table `registrovacunacion`
--
ALTER TABLE `registrovacunacion`
  ADD PRIMARY KEY (`idregistro`),
  ADD KEY `FKegy5e4u081deoqmy863nf3vyo` (`idcentromedico`),
  ADD KEY `FKntgg645ebnjgywm7dsa77t6eg` (`idusuario`),
  ADD KEY `FKtjx71bqv3eiwq24imdu5sqb8f` (`idvacuna`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idusuario`),
  ADD UNIQUE KEY `UK_kfsp0s1tflm1cwlj8idhqsad0` (`email`);

--
-- Indexes for table `vacunascatalogo`
--
ALTER TABLE `vacunascatalogo`
  ADD PRIMARY KEY (`idvacuna`);

--
-- AUTO_INCREMENT for dumped tables
--

ALTER TABLE `alertas`
  MODIFY `idalerta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

ALTER TABLE `centrosmedicos`
  MODIFY `idcentro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

ALTER TABLE `historialpdf`
  MODIFY `idhistorial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `registrovacunacion`
  MODIFY `idregistro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

ALTER TABLE `vacunascatalogo`
  MODIFY `idvacuna` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

ALTER TABLE `alertas`
  ADD CONSTRAINT `FKb0wfdadn9ragyyum6s7xt2vg3` FOREIGN KEY (`idregistro`) REFERENCES `registrovacunacion` (`idregistro`),
  ADD CONSTRAINT `FKqfe4b9xikh69rh9y38ws7k3du` FOREIGN KEY (`idusuario`) REFERENCES `usuarios` (`idusuario`);

ALTER TABLE `historialpdf`
  ADD CONSTRAINT `FKlbns3t94tessf4593ia9v1o18` FOREIGN KEY (`idusuario`) REFERENCES `usuarios` (`idusuario`);

ALTER TABLE `registrovacunacion`
  ADD CONSTRAINT `FKegy5e4u081deoqmy863nf3vyo` FOREIGN KEY (`idcentromedico`) REFERENCES `centrosmedicos` (`idcentro`),
  ADD CONSTRAINT `FKntgg645ebnjgywm7dsa77t6eg` FOREIGN KEY (`idusuario`) REFERENCES `usuarios` (`idusuario`),
  ADD CONSTRAINT `FKtjx71bqv3eiwq24imdu5sqb8f` FOREIGN KEY (`idvacuna`) REFERENCES `vacunascatalogo` (`idvacuna`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
