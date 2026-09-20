import { DocsSidebar } from "../_components/docs/DocsSidebar";
import { DocsMobileMenu } from "../_components/docs/DocsMobileMenu";

// Every page under /docs shares this shell: the tree on the left, the page on the right.
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-x">
      <DocsMobileMenu />
      <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside
          className="hidden lg:block"
          style={{
            position: "sticky",
            top: 64,
            alignSelf: "start",
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            padding: "2.5rem 0 3rem",
            borderRight: "1px solid var(--line)",
            paddingRight: "1.25rem",
          }}
        >
          <DocsSidebar />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
