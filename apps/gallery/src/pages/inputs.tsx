import { useState } from 'react';
import {
  TextField,
  Select,
  ComboBox,
  DonutSlider,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Text,
} from '@mucsi96/react-ui';
import { Demo, PageHeader } from '../components/demo';
import styles from './pages.module.css';

const fruits = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Pear'].map((label) => ({
  id: label.toLowerCase(),
  label,
}));

export default function InputsPage() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [tip, setTip] = useState(15);
  return (
    <>
      <PageHeader
        title="Inputs"
        description="Labeled fields, searchable selections, and expressive numeric input. Native form behavior meets accessible interactions."
      />
      <Demo
        title="Text fields"
        description="Labels and descriptions are connected automatically. Both outlined and filled appearances keep a full border and visible focus."
        code={`<TextField label="Username" placeholder="e.g. mucsi96" />
<TextField label="Email" type="email" value={email} onChange={setEmail} error={error} />
<TextField label="Password" type="password" description="At least 12 characters" />
<TextField label="Bio" multiline />`}
        stack
      >
        <div className={styles.formGrid}>
          <TextField label="Username" placeholder="e.g. mucsi96" />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            onBlur={() => setTouched(true)}
            validationBehavior="aria"
            error={
              touched && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
                ? 'Enter a valid email address.'
                : undefined
            }
          />
          <TextField label="Password" type="password" description="At least 12 characters" />
          <TextField label="Disabled field" defaultValue="Read-only example" isDisabled />
          <TextField label="Filled field" appearance="filled" placeholder="A little more surface" />
          <TextField label="Bio" multiline />
        </div>
      </Demo>
      <Demo
        title="Select and autocomplete"
        code={`<Select label="Favorite fruit" options={fruits} />
<ComboBox label="Search fruits" options={fruits} />`}
        stack
      >
        <div className={styles.formGrid}>
          <Select label="Favorite fruit" options={fruits} />
          <ComboBox label="Search fruits" options={fruits} />
        </div>
      </Demo>
      <Demo
        title="Donut slider"
        description="Tap or drag the dial to set a value. Clockwise rotation adds value across multiple turns. Arrows step, Page Up/Down make larger changes, and Home/End move to optional bounds."
        code={`const [tip, setTip] = useState(15);

<DonutSlider label="Tip" unit="%" value={tip} onChange={setTip} valuePerTurn={20} min={0} max={100} />
<DonutSlider label="Brew time" unit="s" defaultValue={45} valuePerTurn={60} step={5} min={0} />`}
      >
        <DonutSlider
          label="Tip"
          unit="%"
          value={tip}
          onChange={setTip}
          valuePerTurn={20}
          min={0}
          max={100}
        />
        <DonutSlider
          label="Brew time"
          unit="s"
          defaultValue={45}
          valuePerTurn={60}
          step={5}
          min={0}
        />
        <DonutSlider label="Temperature" unit="°C" defaultValue={22} valuePerTurn={10} />
        <Text muted>Selected tip: {tip}%</Text>
      </Demo>
      <Demo
        title="Toggles"
        code={`<Checkbox defaultSelected>Subscribe to newsletter</Checkbox>
<RadioGroup label="Size" defaultValue="medium">
  <Radio value="small">Small</Radio>
  <Radio value="medium">Medium</Radio>
</RadioGroup>
<Switch defaultSelected>Notifications</Switch>`}
      >
        <div className={styles.stack}>
          <Checkbox defaultSelected>Subscribe to newsletter</Checkbox>
          <Checkbox>Product updates</Checkbox>
          <Checkbox isDisabled>Disabled option</Checkbox>
        </div>
        <RadioGroup label="Size" defaultValue="medium">
          <Radio value="small">Small</Radio>
          <Radio value="medium">Medium</Radio>
          <Radio value="large">Large</Radio>
        </RadioGroup>
        <div className={styles.stack}>
          <Switch defaultSelected>Notifications</Switch>
          <Switch>Beta features</Switch>
        </div>
      </Demo>
    </>
  );
}
