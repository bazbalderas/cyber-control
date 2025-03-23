#!/bin/bash
# setup_remote_shutdown.sh - Script para configurar los permisos de apagado remoto

# Colores para mejor legibilidad
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Configuración de permisos para apagado remoto${NC}"
echo "======================================================"

# Verificar que se ejecuta como root
if [ "$(id -u)" -ne 0 ]; then
   echo -e "${RED}Este script debe ejecutarse como root${NC}" 
   echo "Ejecuta: sudo bash setup_remote_shutdown.sh"
   exit 1
fi

# Lista de usuarios a configurar
USERS=("bazito" "gabriel" "jared" "vasti")

# Configurar sudoers para permitir apagado sin contraseña
echo -e "${YELLOW}Configurando permisos de sudo para apagado sin contraseña...${NC}"

for user in "${USERS[@]}"; do
    # Verificar si el usuario existe
    if id "$user" &>/dev/null; then
        # Agregar regla de sudoers para permitir shutdown sin contraseña
        echo "$user ALL=(ALL) NOPASSWD: /sbin/shutdown, /sbin/reboot, /sbin/poweroff" > /etc/sudoers.d/$user-shutdown
        chmod 0440 /etc/sudoers.d/$user-shutdown
        echo -e "${GREEN}Permisos configurados para el usuario $user${NC}"
    else
        echo -e "${RED}El usuario $user no existe en el sistema${NC}"
    fi
done

# Configurar servidor SSH para aceptar conexiones remotas
echo -e "${YELLOW}Configurando servidor SSH...${NC}"

# Hacer backup del archivo de configuración de SSH
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

# Configurar SSH para permitir port forwarding
grep -q "^GatewayPorts" /etc/ssh/sshd_config && \
    sed -i 's/^GatewayPorts.*/GatewayPorts yes/' /etc/ssh/sshd_config || \
    echo "GatewayPorts yes" >> /etc/ssh/sshd_config

# Permitir conexiones como root vía SSH (necesario para apagado)
grep -q "^PermitRootLogin" /etc/ssh/sshd_config && \
    sed -i 's/^PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config || \
    echo "PermitRootLogin yes" >> /etc/ssh/sshd_config

# Reiniciar servicio SSH para aplicar cambios
systemctl restart sshd

echo -e "${GREEN}Configuración de SSH completada${NC}"

# Instrucciones para establecer túneles SSH
echo -e "\n${YELLOW}Para establecer los túneles SSH, cada usuario debe ejecutar:${NC}"
echo -e "Usuario bazito: ${GREEN}ssh -R 2222:localhost:22 bazito@134.209.75.146${NC}"
echo -e "Usuario gabriel: ${GREEN}ssh -R 2223:localhost:22 gabriel@134.209.75.146${NC}"
echo -e "Usuario jared: ${GREEN}ssh -R 2224:localhost:22 jared@134.209.75.146${NC}"
echo -e "Usuario vasti: ${GREEN}ssh -R 2225:localhost:22 vasti@134.209.75.146${NC}"

echo -e "\n${GREEN}Configuración completa. Los usuarios ahora pueden apagar remotamente los equipos.${NC}"
echo -e "${YELLOW}Nota: Para que el sistema web funcione, necesitarás implementar el servidor Node.js.${NC}"