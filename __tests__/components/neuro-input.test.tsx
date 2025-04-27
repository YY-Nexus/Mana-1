import { render, screen } from "@testing-library/react"
import { NeuroInput } from "@/components/neuro-input"
import { Mail } from "lucide-react"

describe("NeuroInput", () => {
  it("renders correctly with default props", () => {
    render(<NeuroInput />)
    const inputElement = screen.getByRole("textbox")
    expect(inputElement).toBeInTheDocument()
    expect(inputElement).toHaveAttribute("aria-invalid", "false")
  })

  it("renders with label", () => {
    render(<NeuroInput label="Email" />)
    expect(screen.getByText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
  })

  it("renders with error message", () => {
    render(<NeuroInput error="Invalid input" />)
    const inputElement = screen.getByRole("textbox")
    const errorMessage = screen.getByText("Invalid input")

    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveAttribute("role", "alert")
    expect(inputElement).toHaveAttribute("aria-invalid", "true")
    expect(inputElement).toHaveAttribute("aria-describedby", expect.stringContaining("-error"))
  })

  it("renders with helper text", () => {
    render(<NeuroInput helperText="Enter your email" />)
    const helperText = screen.getByText("Enter your email")
    const inputElement = screen.getByRole("textbox")

    expect(helperText).toBeInTheDocument()
    expect(inputElement).toHaveAttribute("aria-describedby", expect.stringContaining("-helper"))
  })

  it("renders with icon", () => {
    render(<NeuroInput icon={<Mail data-testid="mail-icon" />} />)
    expect(screen.getByTestId("mail-icon")).toBeInTheDocument()
    expect(screen.getByRole("textbox")).toHaveClass("pl-10")
  })

  it("forwards additional props to input element", () => {
    render(<NeuroInput placeholder="Enter text" type="email" required />)
    const inputElement = screen.getByRole("textbox")

    expect(inputElement).toHaveAttribute("placeholder", "Enter text")
    expect(inputElement).toHaveAttribute("type", "email")
    expect(inputElement).toHaveAttribute("required")
  })

  it("applies custom className", () => {
    render(<NeuroInput className="custom-class" />)
    expect(screen.getByRole("textbox")).toHaveClass("custom-class")
  })
})
