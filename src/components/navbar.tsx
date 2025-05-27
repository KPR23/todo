import { NavbarActions } from './navbar-actions';

export function Navbar() {
  return (
    <div className="flex justify-between items-center p-6 bg-gray-800 text-white">
      <h1>ToDo App</h1>
      <NavbarActions />
    </div>
  );
}
