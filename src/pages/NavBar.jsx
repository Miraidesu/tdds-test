import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Login from "./Login";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { is } from "date-fns/locale";

export default function NavBar() {
  const [userLogged, setUserLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const isUserLogged = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_credentials", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUserLogged(true);
          setUserRole(data.user_type); // Asigna el rol del usuario
          console.log("User role:", data.user_type); // Para depurar el valor de userRole
        }
      }
    } catch (error) {
      console.error("Error al verificar credenciales:", error);
    }
  };

  useEffect(() => {
    isUserLogged();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include"
      });
      
      if (response.ok) {
        setUserLogged(false);
        setUserRole(null);
        navigate("/");
      } else {
        const result = await response.json();
        alert(result.message);
      }
    } catch (error) {
      alert("Error de conexión en el servidor:", error);
    }
  };


  return (
    <div className="fixed z-10 top-0 left-0 w-full p-2 bg-white shadow-md">
      <header className="relative flex justify-center ">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Link to="/">Inicio</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Link to="/faq">Preguntas Frecuentes</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Opciones según el rol del usuario */}
            {userRole === 1 && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Link to="/userSchedule">Pedir Una Cita</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Link to="/Appointments">Mis Citas</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}

            {userRole === 2 && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Link to="/dashboard">Mi Dashboard de citas</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}


            {userLogged && (
              <div className="flex">
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Link to="/modificar">Editar Perfil</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                
              </div>
            )}

            {!userLogged ? (
              <div className="flex">
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Link to="/register">Registrarse</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Login />
                </NavigationMenuItem>
              </div>
            ) : (
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Link to="/index" onClick={handleLogout}>Cerrar sesión</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </header>
    </div>
  );
}
