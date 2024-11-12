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
import { Link } from 'react-router-dom';
import { bg } from "date-fns/locale";

export default function NavBar() {
	return (
    <div className="bg-white fixed top-0 left-0 w-full z-10 shadow-md">
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

        <NavigationMenuItem >
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Link to="/register">Registrarse</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem >
          <Login />
        </NavigationMenuItem>
      
      </NavigationMenuList> 
    </NavigationMenu>
	</header>
	</div>)
}