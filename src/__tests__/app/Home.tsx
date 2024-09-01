import { render, screen, act } from "@testing-library/react";
import Home from "@/app/page";

it('contains the Header component with "City Bike" text', async () => {
  await act(async () => {
    render(<Home />);
  });

  const cityBikeText = screen.getByText(/City Bike/i);
  expect(cityBikeText).toBeInTheDocument();
});
