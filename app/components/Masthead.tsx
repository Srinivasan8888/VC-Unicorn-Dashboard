import { SearchTrigger } from "./SearchTrigger";

export function Masthead() {
  return (
    <nav className="top-nav">
      <a className="top-nav-brand" href="/">
        UNICORNS
      </a>
      <SearchTrigger />
    </nav>
  );
}
