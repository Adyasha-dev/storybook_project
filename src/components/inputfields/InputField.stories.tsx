import type { Meta, StoryObj } from "@storybook/react-vite";
import InputField from "./InputField";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {
    label: "Username",
    placeholder: "Enter your username",
    value: "",
    onChange: () => {},
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    helperText: "We will never share your email.",
    value: "",
    onChange: () => {},
  },
};

export const ErrorState: Story = {
  args: {
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    invalid: true,
    errorMessage: "Password is too weak",
    value: "",
    onChange: () => {},
  },
};

export const PasswordToggle: Story = {
  args: {
    label: "Password",
    placeholder: "Enter password",
    type: "password",
    showPasswordToggle: true,
    value: "",
    onChange: () => {},
  },
};

export const Variants: Story = {
  args: {
    label: "Search",
    placeholder: "Search here...",
    showClearButton: true,
    variant: "filled",
    value: "Hello",
    onChange: () => {},
  },
};
