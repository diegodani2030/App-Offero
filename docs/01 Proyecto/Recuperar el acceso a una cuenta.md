---
tags: [proyecto, procedimiento, seguridad]
responsable: Diego
---
# Recuperar el acceso a una cuenta (piloto)

Procedimiento para cuando un usuario del piloto olvida su contraseña. Lo puede hacer **cualquier integrante con acceso al panel de offero-prod**, sin preguntarle a nadie. Decisión: [[D-14 Recuperar contraseñas a mano durante el piloto|D-14]] (OFF-063, #175).

**Objetivo:** que el usuario vuelva a entrar **el mismo día** (máximo en menos de un día).

> ¿Por qué a mano? El correo incluido en Supabase solo envía 2 correos por hora y solo a miembros de la organización ([[D-09 Correos de confirmación|D-09]]). El enlace «olvidé mi contraseña» no les llegaría a los usuarios reales. El flujo automático con SMTP propio queda como **P1** para después del núcleo.

## 1. El usuario escribe
En `/login` dice: «¿Olvidaste tu contraseña? Escríbele al equipo de Offero por el mismo canal por el que te invitamos al piloto…». El mensaje llega a quien lleva el contacto con su empresa.

## 2. Confirma que es esa persona (no te lo saltes)
Restablecer la contraseña de alguien sin confirmar quién es le entrega la cuenta a cualquiera que la pida.
1. Pide el **correo** con el que se registró y revisa que exista en offero-prod (Authentication → Users).
2. Confírmalo por **un segundo canal que ya conocías antes**: una llamada o un WhatsApp al número que dio su empresa al entrar al piloto, o con la persona de contacto de la empresa. Un mensaje nuevo de un número desconocido **no** basta.
3. Si no puedes confirmarlo, no restablezcas nada y avísale al equipo en Discord.

## 3. Crea una contraseña temporal
- Aleatoria, de **12 caracteres o más** (usa un generador de contraseñas). Una distinta cada vez.
- No uses datos de la persona ni una contraseña que ya hayas usado.

## 4. Restablécela en offero-prod
En el **SQL Editor de offero-prod** (revisa arriba que diga *Offero-prod*), cambia el correo y la contraseña temporal y ejecuta:

```sql
update auth.users
set encrypted_password = extensions.crypt('CONTRASEÑA_TEMPORAL', extensions.gen_salt('bf')),
    updated_at = now()
where email = 'correo@del-usuario.com'
returning email, updated_at;
```

- Debe devolver **una fila** con ese correo. Si devuelve cero, el correo está mal escrito: no ejecutes nada más.
- `crypt` + `gen_salt('bf')` guardan la contraseña con bcrypt, igual que Supabase. **Nunca** escribas la contraseña tal cual en `encrypted_password`.
- No guardes esta consulta con la contraseña en el editor: bórrala después de ejecutarla.

## 5. Entrégale la temporal por un canal privado
- Por mensaje directo o llamada, **nunca** en un grupo, canal público, comentario de GitHub ni documento compartido.
- Dile que entre y la cambie de inmediato.

## 6. El usuario la cambia
1. Entra en `/login` con su correo y la contraseña temporal.
2. Va a **Mi perfil → Cambiar contraseña** (`/perfil/contrasena`).
3. Escribe la temporal como «Contraseña actual» y elige una nueva (8 a 72 caracteres).
4. Desde ese momento la temporal ya no sirve.

## 7. Deja constancia
En Discord, en el canal del equipo: fecha, cuenta (correo) y quién lo hizo. **Nunca la contraseña.**

## Probado
- **24 nov 2026, offero-dev**, con la cuenta de prueba `cliente.e@prueba.com`: después del paso 4 la contraseña vieja dejó de servir y la temporal sí entró; en `/perfil/contrasena` una actual incorrecta y una confirmación distinta se rechazaron; el cambio funcionó, la temporal dejó de servir y la nueva entró.

Volver a [[00 Inicio]]
