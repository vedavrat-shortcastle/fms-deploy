export const renderLabel = (text: string, isRequired: boolean = false) => (
  <>
    <span className="text-sm text-gray-900">{text}</span>
    {isRequired && <span className="text-red-500"> *</span>}
  </>
);
