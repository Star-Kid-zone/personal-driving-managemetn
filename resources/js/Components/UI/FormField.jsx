/**
 * FormField — stable module-level component (never defined inside another component).
 *
 * Defining components inside render functions causes React to treat them as
 * new component types on every render, unmounting/remounting the DOM node and
 * destroying focus after every keystroke.
 *
 * Usage:
 *   <FormField label="Name" error={errors.name} required>
 *       <input className="field" ... />
 *   </FormField>
 *
 *   or shorthand (renders a plain <input> automatically):
 *   <FormField label="Name" name="name" value={data.name} onChange={...} error={errors.name} required />
 */
export default function FormField({
    label,
    error,
    required,
    children,
    // shorthand props — only used when no children are given
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
}) {
    return (
        <div>
            <label className="text-xs text-muted mb-1.5 block font-medium">
                {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {children ?? (
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value ?? ''}
                    onChange={onChange}
                    className={`field ${error ? 'border-red-500/50' : ''}`}
                />
            )}
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
}
