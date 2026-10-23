import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@site-config";
import { MobileMenu } from "@/components/MobileMenu";
import Link from "next/link";

vi.mock("next/navigation", () => ({ usePathname: () => "/services/ai-automation" }));

describe("Nav", () => {
  it("renders the company name and primary links", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: siteConfig.name })).toHaveAttribute("href", "/");
    for (const label of ["Services", "Agents", "Industries", "Examples", "About"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /discuss your workflow/i })).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Insights" })).not.toBeInTheDocument();
  });
  it("does not expose Insights in the footer", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('a[href^="/insights"]')).toBeNull();
    expect(screen.getByRole("link", { name: "Workflow examples" })).toBeVisible();
  });
});

const menuLinks = [
  { href: "/services/ai-automation", label: "Current service" },
  { href: "/agents", label: "Agents" },
];

function renderMenu() {
  return render(<div onClickCapture={(event) => event.preventDefault()}>
    <Link href="/">Home</Link>
    <MobileMenu links={menuLinks} cta={{ href: "/contact", label: "Contact" }} />
    <button type="button">After navigation</button>
  </div>);
}

describe("Mobile menu dismissal", () => {
  it.each(["Current service", "Agents", "Contact"])("closes on %s without waiting for a route change", (label) => {
    document.body.style.overflow = "clip";
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(screen.getByRole("link", { name: label }));
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("clip");
  });

  it("returns keyboard focus to the toggle on Escape", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    screen.getByRole("link", { name: "Agents" }).focus();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes when a pointer selects the logo outside the panel", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.pointerDown(screen.getByRole("link", { name: "Home" }));
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");
  });

  it("closes when keyboard focus leaves instead of hiding focused page content", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.blur(screen.getByRole("link", { name: "Contact" }), { relatedTarget: screen.getByRole("button", { name: "After navigation" }) });
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");
  });

  it("restores the previous scroll state when unmounted", () => {
    document.body.style.overflow = "auto";
    const { unmount } = renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });
});

afterEach(() => { cleanup(); document.body.style.overflow = ""; });
