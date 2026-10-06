import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Gauge, Hash, Search, Thermometer } from "lucide-react";
import {
  Choice,
  CommandPalette,
  ConditionRow,
  Field,
  Group,
  Modal,
  Toggle,
  type Command,
} from "@molarverse/pq-design";
import "@molarverse/pq-design/styles.css";
import "./gallery.css";

function ComponentExample() {
  const [temperature, setTemperature] = useState("300");
  const [thermostat, setThermostat] = useState("langevin");
  const [pressure, setPressure] = useState("1");
  const [thermal, setThermal] = useState(true);
  const [barostat, setBarostat] = useState(false);
  const [periodic, setPeriodic] = useState(true);
  const [restart, setRestart] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [search, setSearch] = useState(false);
  const [selection, setSelection] = useState("Temperature");
  const commands: Command[] = [
    { id: "temperature", group: "Conditions", label: "Temperature", hint: "K", featured: true, run: () => setSelection("Temperature") },
    { id: "pressure", group: "Conditions", label: "Pressure", hint: "bar", featured: true, run: () => setSelection("Pressure") },
    { id: "steps", group: "Run", label: "Steps", featured: true, run: () => setSelection("Steps") },
  ];

  return (
    <main className="gallery">
      <header className="gallery-header">
        <div><h1>PQDesign</h1><p>Component example</p></div>
        <button className="gallery-action" onClick={() => setSearch(true)}>
          <Search size={16} aria-hidden="true" /> Search
        </button>
      </header>
      <div className="gallery-body">
        <section className="gallery-conditions">
          <ConditionRow
            icon={Thermometer}
            title="Temperature"
            info="The application defines units and validates the target temperature."
            toggle={{ label: "Enabled", checked: thermal, onChange: setThermal }}
          >
            <Field label="Target" unit="K"><input type="number" min="0" value={temperature} onChange={(event) => setTemperature(event.target.value)} /></Field>
            <Choice label="Thermostat" value={thermostat} onChange={setThermostat} wide options={[
              { value: "langevin", label: "Langevin" },
              { value: "nose", label: "Nosé–Hoover" },
            ]} />
            <Field label="Coupling" unit="fs"><input type="number" min="0" defaultValue="100" /></Field>
          </ConditionRow>
          <ConditionRow
            icon={Gauge}
            title="Pressure"
            toggle={{ label: "Enabled", checked: barostat, onChange: setBarostat }}
          >
            <Field label="Target" unit="bar"><input type="number" value={pressure} disabled={!barostat} onChange={(event) => setPressure(event.target.value)} /></Field>
          </ConditionRow>
          <ConditionRow icon={Hash} title="Run">
            <Field label="Steps" wide><input type="number" min="1" defaultValue="50000" /></Field>
            <Field label="Timestep" unit="fs" wide><input type="number" min="0" defaultValue="0.5" /></Field>
          </ConditionRow>
        </section>
        <aside>
          <Group title="Options">
            <Toggle label="Periodic" checked={periodic} onChange={setPeriodic} info="Application state is controlled by the consuming interface." />
            <Toggle label="Restart" checked={restart} onChange={setRestart} />
          </Group>
          <div className="gallery-summary">
            <span>Target</span><output>{temperature || "—"} K</output>
            <span>Selected</span><output>{selection}</output>
          </div>
          <button className="gallery-action gallery-primary" onClick={() => setDialog(true)}>Open dialog</button>
        </aside>
      </div>
      <Modal open={dialog} title="Temperature" subtitle="Controlled input with an explicit unit" onClose={() => setDialog(false)}>
        <Field label="Target" unit="K"><input type="number" min="0" value={temperature} onChange={(event) => setTemperature(event.target.value)} /></Field>
        <button className="gallery-action gallery-primary gallery-done" onClick={() => setDialog(false)}>Done</button>
      </Modal>
      <CommandPalette open={search} commands={commands} groupOrder={["Conditions", "Run"]} placeholder="Search conditions or run controls" onClose={() => setSearch(false)} />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<ComponentExample />);
