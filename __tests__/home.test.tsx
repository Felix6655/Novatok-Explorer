import { render, screen } from "@testing-library/react"
import Home from "../src/app/page"

test("renders homepage", () => {
  render(<Home />)
  expect(screen.getByText("NovaTok Explorer")).toBeInTheDocument()
})
