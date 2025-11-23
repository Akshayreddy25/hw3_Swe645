import { useState } from "react";

const initial = {
  first_name: "",
  last_name: "",
  street_address: "",
  city: "",
  state: "",
  zip_code: "",
  telephone: "",
  email: "",
  date_of_survey: "",
  liked_most: [],
  how_interested: [],
  likelihood: "Very Likely",
  comments: "",
};

const likedOptions = [
  "students",
  "location",
  "campus",
  "atmosphere",
  "dorm rooms",
  "sports",
];

const interestedOptions = ["friends", "television", "Internet", "other"];

const likelihoodOptions = ["Very Likely", "Likely", "Unlikely"];

export default function SurveyForm({ onSubmit, initialValues }) {
  const [form, setForm] = useState(
    initialValues
      ? {
          ...initialValues,
          liked_most: (initialValues.liked_most || "")
            .split(",")
            .filter(Boolean),
          how_interested: (initialValues.how_interested || "")
            .split(",")
            .filter(Boolean),
        }
      : initial
  );
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckboxChange(group, value) {
    setForm((prev) => {
      const current = new Set(prev[group]);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      return { ...prev, [group]: Array.from(current) };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!onSubmit) return;

    setSubmitting(true);

    const payload = {
      ...form,
      liked_most: form.liked_most.join(","),
      how_interested: form.how_interested.join(","),
    };

    const ok = await onSubmit(payload);
    if (!initialValues && ok) {
      setForm(initial);
    }
    setSubmitting(false);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>First Name *</label>
          <input
            required
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="Alex"
          />
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input
            required
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="River"
          />
        </div>
        <div className="form-group full">
          <label>Street Address *</label>
          <input
            required
            name="street_address"
            value={form.street_address}
            onChange={handleChange}
            placeholder="4400 University Drive"
          />
        </div>
        <div className="form-group">
          <label>City *</label>
          <input
            required
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Fairfax"
          />
        </div>
        <div className="form-group">
          <label>State *</label>
          <input
            required
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="VA"
          />
        </div>
        <div className="form-group">
          <label>ZIP *</label>
          <input
            required
            name="zip_code"
            value={form.zip_code}
            onChange={handleChange}
            placeholder="22030"
          />
        </div>
        <div className="form-group">
          <label>Telephone *</label>
          <input
            required
            name="telephone"
            value={form.telephone}
            onChange={handleChange}
            placeholder="(555) 555-5555"
          />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="student@example.com"
          />
        </div>
        <div className="form-group">
          <label>Date of Survey *</label>
          <input
            required
            type="date"
            name="date_of_survey"
            value={form.date_of_survey}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full">
          <label>What did you like most about the campus?</label>
          <div className="chip-group">
            {likedOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={
                  form.liked_most.includes(opt)
                    ? "chip chip-active"
                    : "chip"
                }
                onClick={() => handleCheckboxChange("liked_most", opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group full">
          <label>How did you become interested in this university?</label>
          <div className="chip-group">
            {interestedOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={
                  form.how_interested.includes(opt)
                    ? "chip chip-active"
                    : "chip"
                }
                onClick={() => handleCheckboxChange("how_interested", opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group full">
          <label>Likelihood of recommending this school</label>
          <div className="radio-group">
            {likelihoodOptions.map((opt) => (
              <label key={opt} className="radio-item">
                <input
                  type="radio"
                  name="likelihood"
                  value={opt}
                  checked={form.likelihood === opt}
                  onChange={handleChange}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group full">
          <label>Additional Comments (optional)</label>
          <textarea
            name="comments"
            rows="3"
            value={form.comments}
            onChange={handleChange}
            placeholder="Anything else you'd like to share?"
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Survey"}
        </button>
      </div>
    </form>
  );
}
