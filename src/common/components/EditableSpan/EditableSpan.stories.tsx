import {EditableSpan} from './EditableSpan.tsx';

export default {
    title: "EditableSpan Components",
    component: EditableSpan,
    argTypes: {
        onChange: { action: "span changed" },
    },
}

export const EditTableSpanBaseExample  = {
    args: {
        title: 'Learn Storybook',
    },
}