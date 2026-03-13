export interface ComplexityInfo {
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

export const getComplexityInfo = (complexity: number): ComplexityInfo => {
  if (complexity <= 10) {
    return {
      label: "Rendah",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      description: "Kode memiliki risiko rendah dan mudah dipelihara.",
    };
  } else if (complexity <= 20) {
    return {
      label: "Sedang",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      description: "Kode cukup kompleks, disarankan untuk melakukan refactor jika memungkinkan.",
    };
  } else {
    return {
      label: "Tinggi",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      description: "Kode sangat kompleks dan berisiko tinggi. Sangat disarankan untuk memecah fungsi.",
    };
  }
};
