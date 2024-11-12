import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import Login from "./Login";
import { Link, useNavigate } from 'react-router-dom';
import { bg } from "date-fns/locale";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [userLogged, setUserLogged] = useState(false)
  const navigate = useNavigate();

  const isUserLogged = async () => {
    const response = await fetch("http://localhost:5000/get_credentials", {
      method: "GET", // Tipo de solicitud
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Esto asegura que las cookies se envíen con la solicitud
    });
  
    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        setUserLogged(true)
      }
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include"
      })
      
      if (response.ok) {
        navigate("/")
      } else {
        const result = await response.json()
        alert(result.message)
      }
    } catch (error) {
      alert("Error de conexión en el servidor:", error);
    }
  }

  useEffect((
    ) => {
      isUserLogged();
    }
  , []);

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
            <Link to="/">Noticias</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Link to="/">Nosotros</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem >
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Link to="/">Pide tu hora</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {!userLogged ? (
          <div className="flex">
          <NavigationMenuItem >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Link to="/register">Registrarse</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem >
            <Login />
          </NavigationMenuItem>
        </div>
        ) : (
          <NavigationMenuItem >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Link to="/logout" onClick={handleLogout}>Cerrar sesión</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )} 

      </NavigationMenuList> 
    </NavigationMenu>
	</header>
	</div>)
}