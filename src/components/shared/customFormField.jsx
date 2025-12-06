import { Input } from "../ui/input";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { PasswordInput } from "../ui/password-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export const FormFieldType = {
  INPUT: "input",
  PASSWORDINPUT: "passwordInput",
  TEXTAREA: "textarea",
  PHONE_INPUT: "phoneInput",
  CHECKBOX: "checkbox",
  DATE_PICKER: "datePicker",
  SELECT: "select",
  SKELETON: "skeleton",
  CURRENCY: "currency",
  EMAIL: "email",
  NUMBER: "number",
};

const RenderInput = ({ field, className, props, rules }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <FormControl>
          <Input
            type={props.inputType || "text"}
            placeholder={props.placeholder}
            {...field}
            value={field.value || ""}
            className={cn(
              "textBig focus:border-white/50",
              props.className,
              className
            )}
          />
        </FormControl>
      );
    case FormFieldType.NUMBER:
      return (
        <FormControl>
          <Input
            type="number"
            placeholder={props.placeholder}
            {...field}
            value={field.value || ""}
            className={cn(
              "textBig focus:border-white/50",
              props.className,
              className
            )}
          />
        </FormControl>
      );
    case FormFieldType.PASSWORDINPUT:
      return (
        <FormControl>
          <PasswordInput
            placeholder={props.placeholder}
            {...field}
            value={field.value || ""}
            className={cn(
              "textBig focus:border-white/50",
              props.className,
              className
            )}
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value);
            }}
          />
        </FormControl>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            value={field.value || ""}
            className={cn(
              "shad-textArea focus:border-white/50",
              props.className,
              className
            )}
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            value={field.value || ""}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className={cn(
                "flex items-center justify-between rounded-md border h-12 px-4 bg-[#F6F7F9] text-sm text-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                props.className,
                className
              )}
            >
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent
              className={cn(
                "z-[99999] rounded-md border bg-white p-1 text-sm shadow-lg",
                props.contentClassName
              )}
            >
              {props.options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer px-3 py-2 hover:bg-black hover:text-white rounded-md"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="UZ"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value || ""}
            onChange={field.onChange}
            className={cn("input-phone rounded-md", props.className, className)}
            style={{ borderColor: "transparent" }}
            countryCallingCodeEditable={false}
            focusInputOnCountrySelection
          />
        </FormControl>
      );
    case FormFieldType.EMAIL:
      return (
        <FormControl>
          <Input
            type="email"
            placeholder={props.placeholder}
            {...field}
            value={field.value || ""}
            className={cn(
              "textBig focus:border-white/50",
              props.className,
              className
            )}
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <div className="flex items-start space-x-3">
          <FormControl>
            <Checkbox
              checked={field.value || false}
              onCheckedChange={field.onChange}
              disabled={props.disabled}
              className={cn(
                "data-[state=checked]:bg-black data-[state=checked]:border-black mt-1",
                props.className,
                className
              )}
            />
          </FormControl>
          {props.label && (
            <div className="grid gap-1.5 leading-none">
              <label
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                  props.labelClass
                )}
                onClick={() => field.onChange(!field.value)}
              >
                {props.label}
              </label>
            </div>
          )}
        </div>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props) => {
  const { control, name, label, inputClass, optional, labelClass } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1 flex flex-col">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className={cn("text-[#ABAFB1] text-sm", labelClass)}>
              {label}{" "}
              {optional && (
                <span className="text-[12px] text-white/50">{optional}</span>
              )}
            </FormLabel>
          )}
          <RenderInput
            className={cn(
              "text-[#ABAFB1] text-xs lg:text-base bg-transparent",
              inputClass
            )}
            field={field}
            props={props}
          />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
