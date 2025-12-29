import React, { useEffect, useMemo, useState } from "react";
import '../css/components/InterestForm.css';
/* ==== Types ==== */
export interface InterestFormValues {
  name: string;
  preferredName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dob: string;
  phone: string;
  email: string;
  role: "" | "Youth" | "Mentor";
  medicalHistory: string;
  guardianName: string;
  guardianPhone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

type InterestFormErrors = Partial<Record<keyof InterestFormValues, string>>;

interface InterestFormProps {
  onSuccess?: () => void;
}

/* ==== Component ==== */
const initialValues: InterestFormValues = {
  name: "",
  preferredName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  dob: "",
  phone: "",
  email: "",
  role: "",
  medicalHistory: "",
  guardianName: "",
  guardianPhone: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
};

export default function InterestForm({ onSuccess }: InterestFormProps) {
  const [data, setData] = useState<InterestFormValues>(initialValues);
  const [errors, setErrors] = useState<InterestFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  useEffect(() => {
    if (!showSuccessModal) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showSuccessModal]);

  const isYouth: boolean = useMemo(() => data.role === "Youth", [data.role]);

  const setField = <K extends keyof InterestFormValues>(
    k: K,
    v: InterestFormValues[K]
  ) => setData((d) => ({ ...d, [k]: v }));

  function validate(): boolean {
    const e: InterestFormErrors = {};

    // Required (Section 1)
    if (!data.name.trim()) e.name = "Name is required.";
    if (!data.address.trim()) e.address = "Address is required.";
    if (!data.city.trim()) e.city = "City is required.";
    if (!data.state.trim()) e.state = "State is required.";
    if (!data.zip.trim()) e.zip = "Zip code is required.";
    if (!data.phone.trim()) e.phone = "Phone number is required.";
    if (!data.email.trim()) e.email = "Email is required.";
    if (!data.role) e.role = "Select a role.";
    if (!data.dob.trim()) e.dob = "Date of birth is required.";

    // Light format checks
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
      e.email = "Enter a valid email.";
    }
    if (data.phone && !/^[\d()+\-.\s]{7,20}$/.test(data.phone)) {
      e.phone = "Enter a valid phone.";
    }

    // Required for all roles
    if (!data.medicalHistory.trim()) e.medicalHistory = "Medical history is required.";
    if (!data.emergencyContactName.trim()) {
      e.emergencyContactName = "Emergency contact is required.";
    }
    if (!data.emergencyContactPhone.trim()) {
      e.emergencyContactPhone = "Emergency contact phone is required.";
    }
    if (
      data.emergencyContactPhone &&
      !/^[\d()+\-.\s]{7,20}$/.test(data.emergencyContactPhone)
    ) {
      e.emergencyContactPhone = "Enter a valid phone.";
    }

    // Youth-only details
    if (isYouth) {
      if (data.guardianPhone && !/^[\d()+\-.\s]{7,20}$/.test(data.guardianPhone)) {
        e.guardianPhone = "Enter a valid phone.";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8082/api/registration/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = (await res.json()) as { error?: string; message?: string };
        throw new Error(json?.error || json?.message || "Submit failed");
      }

      setData(initialValues);
      setErrors({});
      onSuccess?.();
      setShowSuccessModal(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert("Sorry—there was a problem submitting the form.");
    } finally {
      setSubmitting(false);
    }
  }

  // Change handlers (typed)
  const onInput =
    <K extends keyof InterestFormValues>(key: K) =>
    (
      ev:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => setField(key, ev.target.value as InterestFormValues[K]);

  return (
    <>
      <form className="soc-form" onSubmit={handleSubmit} noValidate>

      <div className="form-grid">
        <Field
          label="Name"
          required
          error={errors.name}
          input={<input id="name" type="text" value={data.name} onChange={onInput("name")} />}
        />

        <Field
          label="Name Preferred"
          error={errors.preferredName}
          input={
            <input
              id="preferredName"
              type="text"
              value={data.preferredName}
              onChange={onInput("preferredName")}
            />
          }
        />

        <Field
          label="Phone Number"
          required
          error={errors.phone}
          input={
            <input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={data.phone}
              onChange={onInput("phone")}
            />
          }
        />

        <Field
          label="Email"
          required
          error={errors.email}
          input={
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={onInput("email")}
            />
          }
        />

        <Field
          label="Role"
          required
          error={errors.role}
          input={
            <select id="role" value={data.role} onChange={onInput("role")}>
              <option value="">Select a role</option>
              <option value="Youth">Youth</option>
              <option value="Mentor">Mentor</option>
            </select>
          }
        />

        <Field
          label="Address"
          required
          error={errors.address}
          input={<input id="address" type="text" value={data.address} onChange={onInput("address")} />}
        />

        <Field
          label="City"
          required
          error={errors.city}
          input={<input id="city" type="text" value={data.city} onChange={onInput("city")} />}
        />

        <Field
          label="State"
          required
          error={errors.state}
          input={<input id="state" type="text" value={data.state} onChange={onInput("state")} />}
        />

        <Field
          label="Zip Code"
          required
          error={errors.zip}
          input={
            <input id="zip" type="text" inputMode="numeric" value={data.zip} onChange={onInput("zip")} />
          }
        />

        <Field
          label="Date of Birth"
          required
          error={errors.dob}
          input={<input id="dob" type="date" value={data.dob} onChange={onInput("dob")} />}
        />
        
        <Field
          label="Emergency Contact"
          required
          error={errors.emergencyContactName}
          input={
            <input
              id="emergencyContactName"
              type="text"
              value={data.emergencyContactName}
              onChange={onInput("emergencyContactName")}
            />
          }
        />

        <Field
          label="Emergency Contact Phone"
          required
          error={errors.emergencyContactPhone}
          input={
            <input
              id="emergencyContactPhone"
              type="tel"
              placeholder="(555) 234-5678"
              value={data.emergencyContactPhone}
              onChange={onInput("emergencyContactPhone")}
            />
          }
        />

        <Field
          label="Medical History"
          required
          error={errors.medicalHistory}
          className="field--full"
          input={
            <textarea
              id="medicalHistory"
              rows={5}
              value={data.medicalHistory}
              onChange={onInput("medicalHistory")}
            />
          }
        />
      </div>

      {isYouth && (
        <>
          <div className="divider" />
          <div className="section-header">
            <h3>Youth Information</h3>
          </div>

          <div className="form-grid">
            <Field
              label="Parent/Guardian Name"
              error={errors.guardianName}
              input={
                <input
                  id="guardianName"
                  type="text"
                  value={data.guardianName}
                  onChange={onInput("guardianName")}
                />
              }
            />

            <Field
              label="Parent/Guardian Phone"
              error={errors.guardianPhone}
              input={
                <input
                  id="guardianPhone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={data.guardianPhone}
                  onChange={onInput("guardianPhone")}
                />
              }
            />
          </div>
        </>
      )}

        <div className="actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <div className="interest-modal" role="dialog" aria-modal="true">
          <div
            className="interest-modal-backdrop"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="interest-modal-card" role="document">
            <h3>Submission received</h3>
            <p>Thanks! Your information has been submitted.</p>
            <div className="interest-modal-actions">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ==== Field subcomponent (typed) ==== */
interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  input: React.ReactNode;
}

function Field({ label, required, error, className, input }: FieldProps) {
  return (
    <div className={`field ${error ? "field--error" : ""} ${className ?? ""}`.trim()}>
      <label>
        <span className="label-text">
          {label} {required && <span className="req">*</span>}
        </span>
        {input}
      </label>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
