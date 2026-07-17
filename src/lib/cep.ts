export type ViaCepAddress = {
  street: string;
  district: string;
  city: string;
  state: string;
};

type ViaCepResponse = {
  erro?: boolean | string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
};

export async function lookupAddressByCep(
  cep: string,
): Promise<ViaCepAddress | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as ViaCepResponse;
  if (data.erro) return null;

  return {
    street: data.logradouro?.trim() || "",
    district: data.bairro?.trim() || "",
    city: data.localidade?.trim() || "",
    state: data.uf?.trim().toUpperCase() || "",
  };
}
