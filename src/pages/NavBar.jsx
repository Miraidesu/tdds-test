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
	<header className="flex justify-center">
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

        <NavigationMenuItem>
          <NavigationMenuTrigger>Cuenta</NavigationMenuTrigger>
          <NavigationMenuContent className="grid gap-3 p-4">
            <Login/>
            <Link to="/register">Registrarse</Link>
          </NavigationMenuContent>
        </NavigationMenuItem>
      
      </NavigationMenuList> 
    </NavigationMenu>
	</header>
	)
}