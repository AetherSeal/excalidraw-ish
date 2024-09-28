export default function Header() {
  return (
    <header className="flex flex-row p-4 bg-slate-800 justify-between">
      <h1>Cavas</h1>
      <nav>
        <ul className="flex flex-row gap-4">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
