import { useUser } from "@clerk/clerk-react";
import {
  Button,
  ComboboxItem,
  MultiSelect,
  OptionsFilter,
} from "@mantine/core";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

const Page = () => {
  const { user } = useUser();
  const [value, setValue] = useState<string[]>([]);

  const d = useQuery(
    api.yt.userCategories,
    user?.id !== undefined ? { id: user.id } : "skip"
  );
  const updatePrefs = useMutation(api.yt.userPrefrence);

  useEffect(() => {
    if (d?.currentPrefrence) {
      setValue(d.currentPrefrence);
    }
  }, [d?.currentPrefrence]);

  async function handleUpate() {
    await updatePrefs({
      id: user!.id,
      prefrence: value,
    });

    alert("Updated");
  }

  return (
    <div className="">
      <MultiSelect
        defaultValue={value}
        label="Select your preferences"
        placeholder="Pick value"
        data={d?.prefs.map((p) => ({
          value: p,
          label: p,
        }))}
        filter={optionsFilter}
        searchable
        value={value}
        onChange={setValue}
        maw={600}
        mx={"auto"}
      />
      <div className="flex justify-center mt-10">
        <Button onClick={handleUpate} variant="outline" color="cyan">
          Update Preferences
        </Button>
      </div>
    </div>
  );
};

export default Page;

const optionsFilter: OptionsFilter = ({ options, search }) => {
  const filtered = (options as ComboboxItem[]).filter((option) =>
    option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
  );

  filtered.sort((a, b) => a.label.localeCompare(b.label));
  return filtered;
};
