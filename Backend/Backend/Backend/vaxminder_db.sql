-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2026 at 05:44 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
  `idusuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alertas`
--

INSERT INTO `alertas` (`idalerta`, `estado`, `fechaalerta`, `fechaenvio`, `mensaje`, `tipoalerta`, `idregistro`, `idusuario`) VALUES
(1, 'pendiente', '2025-06-01', NULL, 'Proxima dosis de COVID-19 Bivalente programada para el 2025-06-01', 'proximadosis', 1, 1192742853),
(2, 'pendiente', '2024-07-27', NULL, 'Proxima dosis de COVID-19 Bivalente programada para el 2024-07-27', 'proximadosis', 2, 1001234567),
(3, 'pendiente', '2025-07-10', NULL, 'Proxima dosis de Influenza programada para el 2025-07-10', 'proximadosis', 3, 1002345678),
(4, 'pendiente', '2034-08-18', NULL, 'Proxima dosis de Fiebre Amarilla programada para el 2034-08-18', 'proximadosis', 4, 1192742853);

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
(1, 'Medellin', 'Calle 64 No 51D-154', 'Hospital San Vicente Fundacion', '6044446000', 'Hospital'),
(2, 'Medellin', 'Diagonal 75B No 2A-80', 'Clinica Las Americas', '6046060666', 'Clinica'),
(3, 'Bello', 'Carrera 50 No 36-10', 'IPS Comfama Bello', '6046048080', 'IPS'),
(4, 'Itagui', 'Carrera 52 No 47-20', 'Unidad de Vacunacion Itagui', '6042770000', 'Centro de Vacunacion'),
(5, 'Medellin', 'Calle 24 No 48-30', 'Hospital General de Medellin', '6043810000', 'Hospital'),
(7, 'Medellin', 'Calle 51 No 45-93', 'Clinica Soma', '6046049191', 'Clinica'),
(8, 'Medellin', 'Carrera 43A No 1-50', 'IPS Sura Centro', '6044441444', 'IPS'),
(9, 'Envigado', 'Calle 38 Sur No 43-13', 'Puesto de Salud Envigado', '6043390000', 'Puesto de Salud'),
(10, 'Medellin', 'Carrera 80 No 48B-80', 'Clinica Leon XIII', '6044508080', 'Clinica'),
(11, 'Medellin', 'Calle 78B No 69-240', 'Centro Salud Pablo Tobon Uribe', '6044459595', 'Hospital');

-- --------------------------------------------------------

--
-- Table structure for table `centrosmedicosauth`
--

CREATE TABLE `centrosmedicosauth` (
  `nit` varchar(20) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `fecharegistro` datetime(6) DEFAULT NULL,
  `razonsocial` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `tipodocumento` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `centrosmedicosauth`
--

INSERT INTO `centrosmedicosauth` (`nit`, `ciudad`, `contrasena`, `direccion`, `fecharegistro`, `razonsocial`, `telefono`, `tipodocumento`) VALUES
('8000123456', 'Medellin', '$2a$10$6b2gNrmB6uo69M.L3bwp8uWmmjXdU4s7O2s.4LNfRvLFYRAjmQcAO', 'Calle 64 No 51D-154', '2026-05-12 01:14:21.000000', 'Hospital San Vicente Fundacion', '6044446000', 'NIT'),
('8000234567', 'Medellin', '$2a$10$VvoP9I/XE2.JbC8UPC435.EEMHwIxVwwyoQFm.6qMef6O769L8TiW', 'Diagonal 75B No 2A-80', '2026-05-12 02:11:37.000000', 'Clinica Las Americas', '6046060666', 'NIT'),
('8000345678', 'Bello', '$2a$10$xCP4trtGdmDq0DmDwS9/1e6Ok8tlFk6y06L2.mSyp0tYIEzZsOKNK', 'Carrera 50 No 36-10', '2026-05-12 02:11:59.000000', 'IPS Comfama Bello', '6046048080', 'NIT'),
('8000456789', 'Itagui', '$2a$10$0DsVVHYaM3wNvHnMSxKIcuB1VIMqskA6x7gdUyIufNfaE3d8/p6fe', 'Carrera 52 No 47-20', '2026-05-12 02:14:01.000000', 'Unidad de Vacunacion Itagui', '6042770000', 'NIT'),
('8000567890', 'Medellin', '$2a$10$Bt8CoxDOLglxgH6Clu9lHOuToL/j3gtTdW.9qP.14B7.8IQuoBvQS', 'Calle 24 No 48-30', '2026-05-12 02:14:19.000000', 'Hospital General de Medellin', '6043810000', 'NIT'),
('8000678901', 'Medellin', '$2a$10$hiwh5cDIQIY/uRpvG5p7i.4XKYLIgD2R9CkZ76Zqt1J9PmhbVuA1C', 'Calle 51 No 45-93', '2026-05-12 02:14:30.000000', 'Clinica Soma', '6046049191', 'NIT'),
('8000789012', 'Medellin', '$2a$10$RRvNFMCllgAMPDfAXH9Awurz4W0CQ9lfJNuo9ogzi64N1Y.211Z3K', 'Carrera 43A No 1-50', '2026-05-12 02:14:42.000000', 'IPS Sura Centro', '6044441444', 'NIT'),
('8000890123', 'Envigado', '$2a$10$iEyyx5b/ZXDc/cqBcrVL1OSie738SBd8O.f1f1dmjyLo8Q21j1kv6', 'Calle 38 Sur No 43-13', '2026-05-12 02:14:54.000000', 'Puesto de Salud Envigado', '6043390000', 'NIT'),
('8000901234', 'Medellin', '$2a$10$KEpmGg9vb78kINt1rbr6SO4HzS8Bzp0wROCMRampZ6JwXU7nECA6i', 'Carrera 80 No 48B-80', '2026-05-12 02:15:05.000000', 'Clinica Leon XIII', '6044508080', 'NIT'),
('8001012345', 'Medellin', '$2a$10$RvBtvJ1wwT8Mbnb4g3WgIOCvtRteIvAJzLawInBB78O3ShEb4LkXa', 'Calle 78B No 69-240', '2026-05-12 02:15:20.000000', 'Centro Salud Pablo Tobon Uribe', '6044459595', 'NIT');

-- --------------------------------------------------------

--
-- Table structure for table `historialpdf`
--

CREATE TABLE `historialpdf` (
  `idhistorial` int(11) NOT NULL,
  `fechageneracion` datetime(6) DEFAULT NULL,
  `nombrearchivo` varchar(255) NOT NULL,
  `rutaarchivo` varchar(255) NOT NULL,
  `idusuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `historialpdf`
--

INSERT INTO `historialpdf` (`idhistorial`, `fechageneracion`, `nombrearchivo`, `rutaarchivo`, `idusuario`) VALUES
(1, '2026-05-12 01:27:09.000000', 'carnet_1192742853_2026-05-12.pdf', '/pdf/carnet_1192742853_2026-05-12.pdf', 1192742853);

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
  `idusuario` int(11) NOT NULL,
  `idvacuna` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registrovacunacion`
--

INSERT INTO `registrovacunacion` (`idregistro`, `fechaaplicacion`, `lotevacuna`, `numerodosis`, `observaciones`, `proximadosisfecha`, `idcentromedico`, `idusuario`, `idvacuna`) VALUES
(1, '2025-05-11', 'LOT202505-01', 1, 'Primera dosis Completada sin novedad', '2025-06-01', 2, 1192742853, 1),
(2, '2024-07-06', 'LOT2024COV001', 1, 'Primera dosis Completada sin novedad', '2024-07-27', 2, 1001234567, 1),
(3, '2024-07-10', 'LOT2024FLU001', 1, 'Sin novedades', '2025-07-10', 2, 1002345678, 2),
(4, '2024-08-20', 'LOT2024FA001', 1, 'Viaje internacional', '2034-08-18', 2, 1192742853, 8),
(5, '2024-07-06', 'LOT2024COV002', 2, 'Segunda dosis completada sin novedad', NULL, 2, 1001234567, 1);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `idusuario` int(11) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fechanacimiento` date NOT NULL,
  `fecharegistro` datetime(6) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `tipodocumento` varchar(255) NOT NULL,
  `tiposangre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`idusuario`, `apellido`, `contrasena`, `email`, `fechanacimiento`, `fecharegistro`, `nombre`, `telefono`, `tipodocumento`, `tiposangre`) VALUES
(1001234567, 'Torres Restrepo', '$2a$10$MDIYhS2m61qQG.c1.N96X.YjEMxPDf/dQXn89L9yKfn6d8xjNUcrG', 'camila.torres@email.com', '1998-03-15', '2026-05-12 01:41:22.000000', 'Camila', '3001234567', 'CC', 'O+'),
(1002345678, 'Gomez Hurtado', '$2a$10$RboV8KBXXmiBwybX5s1zdugyVzhRTWLl4rZiHfaGPW6DDaWhkTXEi', 'andres.gomez@email.com', '1995-07-22', '2026-05-12 01:43:19.000000', 'Andres', '3112345678', 'CC', 'A+'),
(1003456789, 'Cardona Lopez', '$2a$10$9PJsIGhDp2GKkHiStJBVIeCDat/MGuPAPnjQZTkcSqUneRH3972Y6', 'valentina.cardona@email.com', '2001-11-08', '2026-05-12 01:54:43.000000', 'Valentina', '3223456789', 'CC', 'B+'),
(1004567890, 'Arango Velez', '$2a$10$q9pSgmDoHuUQ4Tfd8hGcAuQ0aUkoDKVatTtVQUmnXfYHct8UE5LsG', 'sebastian.arango@email.com', '1990-05-30', '2026-05-12 01:56:17.000000', 'Sebastian', '3004567890', 'CC', 'AB+'),
(1038134116, 'Mestra Lopez', '$2a$10$hlf/JA/.v7XXsIEgsXGSheeY4SYbPlm64gpEZclUykCTMdmdVAo5.', 'carlosm@email.com', '2010-12-09', '2026-05-12 02:00:02.000000', 'Carlos', '3136657604', 'TI', 'O+'),
(1192742853, 'Mestra', '$2a$10$QcURoIPn2AhFjpcInq6S..8bw8wWCTdprXtP2xKNdk1hhmOEFkJUW', 'ammestra3@hotmail.com', '1999-07-09', '2026-05-12 01:15:02.000000', 'Anna', '3008121497', 'CC', 'A+');

-- --------------------------------------------------------

--
-- Table structure for table `vacunascatalogo`
--

CREATE TABLE `vacunascatalogo` (
  `idvacuna` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `dosisrequeridas` int(11) NOT NULL,
  `edadrecomendada` varchar(255) DEFAULT NULL,
  `intervalodosisdias` int(11) DEFAULT NULL,
  `nombrevacuna` varchar(255) NOT NULL,
  `requiererefuerzo` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vacunascatalogo`
--

INSERT INTO `vacunascatalogo` (`idvacuna`, `descripcion`, `dosisrequeridas`, `edadrecomendada`, `intervalodosisdias`, `nombrevacuna`, `requiererefuerzo`) VALUES
(1, 'Vacuna bivalente contra COVID-19', 2, 'adultos', 21, 'COVID-19 Bivalente', b'1'),
(2, 'Vacuna trivalente contra la gripe estacional', 1, 'todas', 365, 'Influenza', b'1'),
(3, 'Sarampion, Paperas y Rubeola', 2, '0-12', 30, 'Triple Viral MMR', b'0'),
(4, 'Vacuna contra el virus de la Hepatitis B', 3, 'todas', 30, 'Hepatitis B', b'0'),
(5, 'Difteria, Pertosis y Tetanos', 5, '0-5', 60, 'DPT Pentavalente', b'0'),
(6, 'Vacuna oral contra la Poliomielitis', 4, '0-5', 60, 'Polio VOP', b'0'),
(7, 'Virus del Papiloma Humano', 2, '9-26', 180, 'VPH Bivalente', b'0'),
(8, 'Obligatoria para viajes internacionales', 1, 'adultos', 3650, 'Fiebre Amarilla', b'1'),
(9, 'Contra diarreas graves en bebes', 3, '0-2', 30, 'Rotavirus', b'0'),
(10, 'Refuerzo de Tetanos para adultos', 1, 'adultos', 3650, 'Tetanos Td', b'1');

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
-- Indexes for table `centrosmedicosauth`
--
ALTER TABLE `centrosmedicosauth`
  ADD PRIMARY KEY (`nit`);

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

--
-- AUTO_INCREMENT for table `alertas`
--
ALTER TABLE `alertas`
  MODIFY `idalerta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `centrosmedicos`
--
ALTER TABLE `centrosmedicos`
  MODIFY `idcentro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `historialpdf`
--
ALTER TABLE `historialpdf`
  MODIFY `idhistorial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `registrovacunacion`
--
ALTER TABLE `registrovacunacion`
  MODIFY `idregistro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vacunascatalogo`
--
ALTER TABLE `vacunascatalogo`
  MODIFY `idvacuna` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alertas`
--
ALTER TABLE `alertas`
  ADD CONSTRAINT `FKb0wfdadn9ragyyum6s7xt2vg3` FOREIGN KEY (`idregistro`) REFERENCES `registrovacunacion` (`idregistro`),
  ADD CONSTRAINT `FKqfe4b9xikh69rh9y38ws7k3du` FOREIGN KEY (`idusuario`) REFERENCES `usuarios` (`idusuario`);

--
-- Constraints for table `historialpdf`
--
ALTER TABLE `historialpdf`
  ADD CONSTRAINT `FKlbns3t94tessf4593ia9v1o18` FOREIGN KEY (`idusuario`) REFERENCES `usuarios` (`idusuario`);

--
-- Constraints for table `registrovacunacion`
--
ALTER TABLE `registrovacunacion`
  ADD CONSTRAINT `FKegy5e4u081deoqmy863nf3vyo` FOREIGN KEY (`idcentromedico`) REFERENCES `centrosmedicos` (`idcentro`),
  ADD CONSTRAINT `FKntgg645ebnjgywm7dsa77t6eg` FOREIGN KEY (`idusuario`) REFERENCES `usuarios` (`idusuario`),
  ADD CONSTRAINT `FKtjx71bqv3eiwq24imdu5sqb8f` FOREIGN KEY (`idvacuna`) REFERENCES `vacunascatalogo` (`idvacuna`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
