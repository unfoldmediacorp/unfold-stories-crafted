import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  /** Duration in ms. Defaults to 700ms for a premium, understated feel. */
  duration?: number;
  /** Vertical translate distance in px. Defaults to 24px. */
  distance?: number;
};

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  duration = 700,
  distance = 24,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  // Once the transition has run, drop the compositor hint. Leaving
  // will-change on every revealed block permanently costs a layer each.
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced motion: reveal immediately, no transform.
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      setSettled(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || settled) return;
    const t = window.setTimeout(() => setSettled(true), delay + duration + 50);
    return () => window.clearTimeout(t);
  }, [visible, settled, delay, duration]);

  const Component = Tag as ElementType;
  return (
    <Component
      ref={ref as never}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0,0,0)" : `translate3d(0,${distance}px,0)`,
        willChange: settled ? "auto" : "opacity, transform",
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  /** Delay between child reveals, in ms. */
  stagger?: number;
  /** Base delay applied to the first child, in ms. */
  baseDelay?: number;
  as?: ElementType;
  className?: string;
  duration?: number;
  distance?: number;
};

/**
 * Wraps each direct child in a Reveal with a staggered delay.
 * Non-element children (strings, null) are passed through untouched.
 */
export function RevealGroup({
  children,
  stagger = 80,
  baseDelay = 0,
  as: Tag = "div",
  className = "",
  duration = 700,
  distance = 24,
}: RevealGroupProps) {
  const Component = Tag as ElementType;
  let index = 0;
  const wrapped = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const delay = baseDelay + index * stagger;
    index += 1;
    return (
      <Reveal
        key={(child as ReactElement).key ?? index}
        delay={delay}
        duration={duration}
        distance={distance}
      >
        {child}
      </Reveal>
    );
  });
  return <Component className={className}>{wrapped}</Component>;
}
