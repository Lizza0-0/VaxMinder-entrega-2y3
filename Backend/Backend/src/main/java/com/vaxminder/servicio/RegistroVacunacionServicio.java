package com.vaxminder.servicio;

import com.vaxminder.dto.RegistroVacunacionDTO;
import com.vaxminder.modelo.*;
import com.vaxminder.repositorio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RegistroVacunacionServicio {

    @Autowired private RegistroVacunacionRepositorio registroRepo;
    @Autowired private UsuariosRepositorio           usuariosRepo;
    @Autowired private VacunasCatalogoRepositorio    vacunasRepo;
    @Autowired private CentrosMedicosRepositorio     centrosRepo;
    @Autowired private AlertasRepositorio            alertasRepo;

    public List<RegistroVacunacion> listarTodos() { return registroRepo.findAll(); }
    public Optional<RegistroVacunacion> buscarPorId(Integer id) { return registroRepo.findById(id); }
    public List<RegistroVacunacion> buscarPorUsuario(Integer id) { return registroRepo.findByUsuario(id); }

    public RegistroVacunacion guardar(RegistroVacunacionDTO dto) {
        Usuarios usuario = usuariosRepo.findById(dto.getIdusuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + dto.getIdusuario()));
        VacunasCatalogo vacuna = vacunasRepo.findById(dto.getIdvacuna())
                .orElseThrow(() -> new RuntimeException("Vacuna no encontrada: " + dto.getIdvacuna()));

        RegistroVacunacion r = new RegistroVacunacion();
        r.setIdusuario(usuario);
        r.setIdvacuna(vacuna);
        r.setFechaaplicacion(dto.getFechaaplicacion());
        r.setNumerodosis(dto.getNumerodosis());
        r.setLotevacuna(dto.getLotevacuna());
        r.setObservaciones(dto.getObservaciones());
        r.setProximadosisfecha(dto.getProximadosisfecha());

        if (dto.getIdcentromedico() != null)
            centrosRepo.findById(dto.getIdcentromedico()).ifPresent(r::setIdcentromedico);

        RegistroVacunacion guardado = registroRepo.save(r);

        if (dto.getProximadosisfecha() != null) {
            Alertas alerta = new Alertas();
            alerta.setIdusuario(usuario);
            alerta.setIdregistro(guardado);
            alerta.setTipoalerta("proximadosis");
            alerta.setFechaalerta(dto.getProximadosisfecha());
            alerta.setMensaje("Próxima dosis de " + vacuna.getNombrevacuna()
                    + " programada para el " + dto.getProximadosisfecha());
            alerta.setEstado("pendiente");
            alertasRepo.save(alerta);
        }
        return guardado;
    }
}
