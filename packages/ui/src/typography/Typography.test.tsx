import { render, screen } from "@testing-library/react";
import {
  DisplayHeading,
  SectionHeading,
  SubHeading,
  BodyText,
  CaptionText,
  CodeInline,
  Label,
  Badge,
  Tag,
  MonoValue,
  UnitLabel,
  GradientText,
} from "./Typography";

describe("DisplayHeading", () => {
  it("renders as h1 by default", () => {
    render(<DisplayHeading>Test</DisplayHeading>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
  it("renders children", () => {
    render(<DisplayHeading>Hello World</DisplayHeading>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
  it("accepts custom className", () => {
    render(<DisplayHeading className="custom">Test</DisplayHeading>);
    expect(screen.getByRole("heading")).toHaveClass("custom");
  });
  it("accepts as prop to change element", () => {
    render(<DisplayHeading as="h2">Test</DisplayHeading>);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});

describe("SectionHeading", () => {
  it("renders as h2 by default", () => {
    render(<SectionHeading>Section</SectionHeading>);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
  it("renders icon when provided", () => {
    render(<SectionHeading icon={<span data-testid="icon" />}>Section</SectionHeading>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});

describe("SubHeading", () => {
  it("renders as h3", () => {
    render(<SubHeading>Sub</SubHeading>);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });
});

describe("BodyText", () => {
  it("renders as p by default", () => {
    const { container } = render(<BodyText>Body content</BodyText>);
    expect(container.querySelector("p")).toBeInTheDocument();
  });
  it("renders muted variant", () => {
    render(<BodyText variant="muted">Muted</BodyText>);
    expect(screen.getByText("Muted")).toBeInTheDocument();
  });
});

describe("CaptionText", () => {
  it("renders as figcaption by default", () => {
    const { container } = render(<CaptionText>Caption</CaptionText>);
    expect(container.querySelector("figcaption")).toBeInTheDocument();
  });
});

describe("CodeInline", () => {
  it("renders as code element", () => {
    const { container } = render(<CodeInline>const x = 1</CodeInline>);
    expect(container.querySelector("code")).toBeInTheDocument();
  });
  it("renders text content", () => {
    render(<CodeInline>model.fit()</CodeInline>);
    expect(screen.getByText("model.fit()")).toBeInTheDocument();
  });
});

describe("Label", () => {
  it("renders text", () => {
    render(<Label>Input Layer</Label>);
    expect(screen.getByText("Input Layer")).toBeInTheDocument();
  });
});

describe("Badge", () => {
  it("renders with default variant", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });
  it("renders all variants without error", () => {
    const variants = ["neuron", "data", "attention", "loss", "accuracy"] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    });
  });
});

describe("Tag", () => {
  it("renders text", () => {
    render(<Tag>transformer</Tag>);
    expect(screen.getByText("transformer")).toBeInTheDocument();
  });
});

describe("MonoValue", () => {
  it("renders numeric value", () => {
    render(<MonoValue>0.923</MonoValue>);
    expect(screen.getByText("0.923")).toBeInTheDocument();
  });
  it("renders as span", () => {
    const { container } = render(<MonoValue>42</MonoValue>);
    expect(container.querySelector("span")).toBeInTheDocument();
  });
});

describe("UnitLabel", () => {
  it("renders value and unit", () => {
    render(<UnitLabel value="512" unit="params" />);
    expect(screen.getByText("512")).toBeInTheDocument();
    expect(screen.getByText("params")).toBeInTheDocument();
  });
});

describe("GradientText", () => {
  it("renders children", () => {
    render(<GradientText>Attention</GradientText>);
    expect(screen.getByText("Attention")).toBeInTheDocument();
  });
  it("accepts from/to color props", () => {
    render(<GradientText from="neuron" to="attention">Test</GradientText>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
