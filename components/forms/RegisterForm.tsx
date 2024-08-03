"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroupItem, RadioGroup } from "../ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";

export default function RegisterForm({ user }: { user: User }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);
    let formData;

    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      // console.log(values.identificationDocument, "<- docc");

      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData
      }

      const patient = await registerPatient(patientData);
      if (patient) router.push(`/patients/${user.$id}/new-appointment`);
      setIsLoading(false)
    } catch (error) {
      console.log("error submit => ", error);
      setIsLoading(false)
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((onSubmit))}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="email"
            label="Email"
            placeholder="John@mail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="phone"
            label="Phone Number"
            placeholder="(62) 123-456"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            name="birthDate"
            label="Date of Birth"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option, idx) => (
                    <div key={idx} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label className="cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="address"
            label="Address"
            placeholder="Jl Panjang, Kedoya"
          />{" "}
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="occupation"
            label="Occupation"
            placeholder="Lawyer"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="emergencyContactName"
            label="Emegercy contact name"
            placeholder="Malih"
          />{" "}
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="emergencyContactNumber"
            label="Emegercy contact number"
            placeholder="0812 3456 7890"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a physician"
        >
          {Doctors.map((doctor, idx) => (
            <SelectItem key={`${doctor.name}${idx}`} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2 ">
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  className="rounded-full border border-dark-500"
                  alt={doctor.name}
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="insuranceProvider"
            label="Insurance provider"
            placeholder="BlueCroos BlueShield"
          />{" "}
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="insurancePolicyNumber"
            label="Insurance policy number"
            placeholder="ABC123321123"
          />{" "}
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="allergies"
            label="Allergies (opsional)"
            placeholder="Peanuts, sulfa"
          />{" "}
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="currentMedication"
            label="Current medication (opsional)"
            placeholder="ABC123321123"
          />{" "}
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="familyMedicalHistory"
            label="Family medical history"
            placeholder="Father vertigo"
          />{" "}
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="pastMedicalHistory"
            label="Past medical history"
            placeholder="Appendectomy"
          />{" "}
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name="identificationType"
          label="Identification Type"
          placeholder="Select an identification type"
        >
          {IdentificationTypes.map((type, idx) => (
            <SelectItem key={`${type}-${idx}`} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="identificationNumber"
          label="Identification Number"
          placeholder="987654321"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SKELETON}
          name="identificationDocument"
          label="Identification Document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.CHECKBOX}
          name="treatmentConsent"
          label="I consent to treatment"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.CHECKBOX}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.CHECKBOX}
          name="privacyConsent"
          label="I consent to privacy policy"
        />

        <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
      </form>
    </Form>
  );
}
