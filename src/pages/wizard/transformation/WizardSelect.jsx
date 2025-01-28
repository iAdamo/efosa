import { Button, FieldError, ListBox, ListBoxItem, Popover, Select, SelectValue, Text } from "react-aria-components";

export function WizardSelect({ label, description, errorMessage, children, items, ...props }) {
  return (
    <Select {...props} className={"last:rounded-b first:rounded-t w-full"}>
      <Button
        className={
          "relative px-[20px] py-[10px] flex flex-col items-start gap-[2px] w-full justify-between border border-grey-13 rounded-api-component  hover:border-secondary-yellow hover:bg-secondary-yellow/10 focus-within:border-secondary-yellow focus-within:bg-secondary-yellow/10"
        }>
        <SelectValue>
          {({ defaultChildren, isPlaceholder }) => {
            return isPlaceholder ? (
              <span className="text-grey-5 text-ellipsis overflow-hidden">{label || "Select"}</span>
            ) : (
              <div className="flex flex-col p-[2px] text-left">
                <span className="text-grey-5 text-ellipsis overflow-hidden">{label}</span>
                <span>{defaultChildren}</span>
              </div>
            );
          }}
        </SelectValue>
      </Button>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className={"bg-[#080808] border rounded-b-base border-grey-1"}>
        <ListBox items={items}>{children}</ListBox>
      </Popover>
    </Select>
  );
}

export function SelectItem(props) {
  return (
    <ListBoxItem
      {...props}
      className={({ isFocused, isSelected }) =>
        `w-[180px] px-[20px] py-[10px] ${isFocused ? " bg-secondary-yellow/10 border-secondary-yellow border" : ""} ${isSelected ? " bg-secondary-yellow/10" : ""}`
      }
    />
  );
}
