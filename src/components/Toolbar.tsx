import { NavLink } from "react-router";
import "./Toolbar.css";

type NavItem =
  | {
      title: string;
      to: string;
      onClick?: never;
    }
  | {
      title: string;
      to?: never;
      onClick: () => void;
    };

interface ToolbarProps {
  onConfigurationClick: () => void;
}

export function Toolbar({ onConfigurationClick }: ToolbarProps) {
  const items: NavItem[] = [
    { title: "Crear Factura", to: "/facturar" },
    { title: "Consultar Facturas", to: "/facturas" },
    { title: "Configuración", onClick: onConfigurationClick },
  ];

  return (
    <nav className="toolbar">
      <ul>
        <li>
          <NavLink to="/">
            <strong>Factuweb</strong>
          </NavLink>
        </li>
      </ul>
      <ul>
        {items.map((item) => (
          <li key={item.title}>
            {item.to ? (
              <NavLink to={item.to} role="button">
                {item.title}
              </NavLink>
            ) : (
              <a role="button" onClick={item.onClick}>
                {item.title}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
