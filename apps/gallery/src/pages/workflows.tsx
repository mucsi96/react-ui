import { useState } from 'react';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Dialog,
  DialogTrigger,
  EmptyState,
  MultiSelect,
  NumberField,
  LoadingArea,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
} from '@mucsi96/react-ui';
import { Demo, PageHeader } from '../components/demo';
import styles from './pages.module.css';

const options = [
  { id: 'vocabulary', label: 'Vocabulary' },
  { id: 'grammar', label: 'Grammar' },
  { id: 'speech', label: 'Speech', isDisabled: true },
];

export default function WorkflowsPage() {
  const [saved, setSaved] = useState('');
  return (
    <>
      <PageHeader
        title="Workflow primitives"
        description="Bounded numbers, multi-selection, long forms, and content states."
      />
      <Demo
        title="Numeric and grouped fields"
        stack
        code={`<NumberField label="Daily limit" name="limit" minValue={1} maxValue={100} step={1} isRequired />
<CheckboxGroup label="Card types" name="types" isRequired>
  <Checkbox value="vocabulary">Vocabulary</Checkbox>
  <Checkbox value="grammar">Grammar</Checkbox>
</CheckboxGroup>
<MultiSelect label="Topics" options={options} />`}
      >
        <form
          className={styles.stack}
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setSaved(`${data.get('limit')}: ${data.getAll('types').join(', ')}`);
          }}
        >
          <NumberField
            label="Daily limit"
            name="limit"
            defaultValue={2}
            minValue={1}
            maxValue={100}
            step={1}
            isRequired
            description="Between 1 and 100 cards."
          />
          <NumberField label="Disabled limit" value={5} isDisabled />
          <CheckboxGroup
            label="Card types"
            name="types"
            isRequired
            description="Choose at least one type."
          >
            {options.map((option) => (
              <Checkbox key={option.id} value={option.id} isDisabled={option.isDisabled}>
                {option.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
          <MultiSelect label="Topics" options={options} description="Choose more than one topic." />
          <Button type="submit">Save preferences</Button>
          <output aria-label="Saved preferences">{saved}</output>
        </form>
      </Demo>
      <Demo
        title="Long form dialog"
        code={`<Dialog title="Edit collection" size="large" footer={({ close }) => <>
  <Button variant="text" onPress={close}>Cancel</Button>
  <Button type="submit" form="collection-form">Save collection</Button>
</>}>
  <form id="collection-form" onSubmit={save}>…</form>
</Dialog>`}
      >
        <DialogTrigger>
          <Button>Edit collection</Button>
          <Dialog
            title="Edit collection"
            size="large"
            footer={({ close }) => (
              <>
                <Button variant="text" onPress={close}>
                  Cancel
                </Button>
                <Button type="submit" form="collection-form">
                  Save collection
                </Button>
              </>
            )}
          >
            {({ close }) => (
              <form
                id="collection-form"
                className={styles.stack}
                onSubmit={(event) => {
                  event.preventDefault();
                  setSaved('Collection saved');
                  close();
                }}
              >
                <TextField label="Collection name" name="name" isRequired />
                {Array.from({ length: 12 }, (_, index) => (
                  <TextField key={index} label={`Note ${index + 1}`} />
                ))}
              </form>
            )}
          </Dialog>
        </DialogTrigger>
      </Demo>
      <Demo
        title="Content tabs"
        stack
        code={`<Tabs>
  <TabList aria-label="Collection views"><Tab id="items">Items</Tab><Tab id="summary">Summary</Tab></TabList>
  <TabPanel id="items">…</TabPanel><TabPanel id="summary">…</TabPanel>
</Tabs>`}
      >
        <Tabs>
          <TabList aria-label="Collection views">
            <Tab id="items">Items</Tab>
            <Tab id="summary">Summary</Tab>
            <Tab id="disabled" isDisabled>
              Archived
            </Tab>
          </TabList>
          <TabPanel id="items">
            <EmptyState
              title="No items yet"
              description="Create your first item to start this collection."
              action={<Button onPress={() => setSaved('Item requested')}>Add item</Button>}
            />
          </TabPanel>
          <TabPanel id="summary">Your collection summary appears here.</TabPanel>
        </Tabs>
      </Demo>
      <Demo title="Collection loading" stack code={`<LoadingArea label="Loading collection" />`}>
        <LoadingArea label="Loading collection" />
      </Demo>
    </>
  );
}
