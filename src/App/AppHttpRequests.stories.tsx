import { AppHttpRequests } from "./AppHttpRequests.tsx";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import type { Decorator } from "@storybook/react-vite";

const withRedux: Decorator = (Story) => (
    <Provider store={store}>
        <Story />
    </Provider>
);

export default {
    title: "App Component",
    component: AppHttpRequests,
    decorators: [withRedux],
};

export const AppHttpRequestsBaseExample = {};