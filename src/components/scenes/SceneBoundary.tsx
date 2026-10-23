"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

export class SceneBoundary extends Component<{
  children: ReactNode;
  onUnavailable: () => void;
  name: string;
}, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`${this.props.name} WebGL failed; showing preview.`, error, info.componentStack);
    this.props.onUnavailable();
  }
  render() { return this.state.failed ? null : this.props.children; }
}
