import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { CreateFoundPetDto } from '../dto/create-found-pet.dto';
import { generateDualMapboxImage } from 'src/core/utils/utils';

export const generateFoundPetEmailTemplate = (
  foundPet: CreateFoundPetDto,
  lostPet: LostPet,
  distanceMeters: number,
  lostLat: number,
  lostLon: number,
): string => {
  const mapUrl = generateDualMapboxImage(
    lostLat,
    lostLon,
    foundPet.lat,
    foundPet.lon,
  );

  const date = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const distanceText =
    distanceMeters < 1000
      ? `${Math.round(distanceMeters)} metros`
      : `${(distanceMeters / 1000).toFixed(1)} km`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:32px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#f97316,#fb923c);padding:32px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <span style="display:inline-block;background-color:rgba(255,255,255,0.2);color:#ffffff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;">
                        🐾 PetRadar – Posible Coincidencia
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:16px;">
                      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;line-height:1.3;">
                        ¡Encontraron una mascota cerca de donde perdiste a ${lostPet.name}!
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:10px;">
                      <span style="display:inline-block;background-color:#ffffff;color:#f97316;font-size:13px;font-weight:700;padding:6px 16px;border-radius:20px;">
                        A ${distanceText} de distancia
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Tu mascota perdida -->
            <tr>
              <td style="padding:28px 40px 0;">
                <h2 style="margin:0 0 14px;font-size:14px;font-weight:700;color:#f97316;text-transform:uppercase;letter-spacing:0.5px;">
                  🔴 Tu mascota perdida
                </h2>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border-radius:12px;border:1px solid #fed7aa;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="50%" style="padding-bottom:10px;">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Nombre</span><br/>
                            <span style="font-size:15px;color:#1f2937;font-weight:600;">${lostPet.name}</span>
                          </td>
                          <td width="50%" style="padding-bottom:10px;">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Especie</span><br/>
                            <span style="font-size:15px;color:#1f2937;font-weight:600;">${lostPet.species}</span>
                          </td>
                        </tr>
                        <tr>
                          <td width="50%" style="padding-bottom:10px;">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Raza</span><br/>
                            <span style="font-size:15px;color:#1f2937;font-weight:600;">${lostPet.breed}</span>
                          </td>
                          <td width="50%" style="padding-bottom:10px;">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Color</span><br/>
                            <span style="font-size:15px;color:#1f2937;font-weight:600;">${lostPet.color}</span>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Última ubicación conocida</span><br/>
                            <span style="font-size:14px;color:#1f2937;">${lostPet.address}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Mascota encontrada -->
            <tr>
              <td style="padding:20px 40px 0;">
                <h2 style="margin:0 0 14px;font-size:14px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.5px;">
                  🟢 Mascota encontrada
                </h2>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="50%" style="padding-bottom:10px;">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Especie</span><br/>
                            <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.species}</span>
                          </td>
                          <td width="50%" style="padding-bottom:10px;">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Color</span><br/>
                            <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.color}</span>
                          </td>
                        </tr>
                        <tr>
                          <td width="50%" style="padding-bottom:10px;">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Tamaño</span><br/>
                            <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.size}</span>
                          </td>
                          <td width="50%" style="padding-bottom:10px;">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Raza (aprox.)</span><br/>
                            <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.breed ?? 'No identificada'}</span>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding-bottom:10px;">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Descripción</span><br/>
                            <span style="font-size:14px;color:#1f2937;">${foundPet.description}</span>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Encontrada en</span><br/>
                            <span style="font-size:14px;color:#1f2937;">${foundPet.address}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Datos de quien la encontró -->
            <tr>
              <td style="padding:20px 40px 0;">
                <h2 style="margin:0 0 14px;font-size:14px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">
                  📞 Contacto de quien la encontró
                </h2>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fb;border-radius:12px;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="33%" style="padding-bottom:8px;">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Nombre</span><br/>
                            <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.finder_name}</span>
                          </td>
                          <td width="33%" style="padding-bottom:8px;">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Teléfono</span><br/>
                            <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.finder_phone}</span>
                          </td>
                          <td width="33%" style="padding-bottom:8px;">
                            <span style="font-size:12px;color:#9ca3af;font-weight:500;">Correo</span><br/>
                            <span style="font-size:14px;color:#1f2937;font-weight:600;">${foundPet.finder_email}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Mapa -->
            <tr>
              <td style="padding:24px 40px;">
                <p style="margin:0 0 10px;font-size:13px;color:#6b7280;">
                  🔴 Donde se perdió &nbsp;|&nbsp; 🟢 Donde fue encontrada
                </p>
                <img src="${mapUrl}" width="520" style="width:100%;border-radius:12px;display:block;" alt="Mapa de ubicaciones"/>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:0 40px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;padding-top:20px;">
                  <tr>
                    <td>
                      <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
                        Notificación generada el ${date}
                      </p>
                      <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">
                        🐾 PetRadar – Sistema de detección de mascotas perdidas
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};