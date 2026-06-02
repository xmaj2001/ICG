"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Loader2, ArrowLeft, Car, Bike } from "lucide-react";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { VehicleFormSchema } from "@/lib/schema";
import {
  Fuel,
  Transmission,
  Category,
  Status,
  Badge,
  VehicleType,
  type Vehicle,
} from "@/lib/vehicles/type";
import { useImageUpload } from "@/hooks/use-image-upload";
import { createVehicle } from "@/lib/vehicles/use-case/create-vehicle";
import { updateVehicle } from "@/lib/vehicles/use-case/update-vehicle";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface VehicleFormProps {
  vehicle?: Vehicle | null;
}

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const isEdit = !!vehicle;
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const { upload, isUploading } = useImageUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof VehicleFormSchema>>({
    resolver: zodResolver(VehicleFormSchema) as any,
    defaultValues: {
      vehicleType: VehicleType.CARRO,
      brand: "",
      model: "",
      year: 2024,
      price: 0,
      engineSize: 2.0,
      fuel: Fuel.GASOLINA,
      transmission: Transmission.AUTOMATICO,
      category: Category.SUV,
      description: "",
      status: Status.DISPONIVEL,
      badge: undefined,
      images: [],
    },
  });

  const watchedType = form.watch("vehicleType");
  const isMota = watchedType === VehicleType.MOTA;

  useEffect(() => {
    if (vehicle) {
      form.reset({
        vehicleType: vehicle.vehicleType ?? VehicleType.CARRO,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        engineSize: vehicle.engineSize,
        fuel: vehicle.fuel as Fuel,
        transmission: vehicle.transmission as Transmission,
        category: vehicle.category as Category,
        description: vehicle.description,
        status: vehicle.status as Status,
        badge: vehicle.badge as Badge | undefined,
        images: vehicle.images,
      });
      setImages(vehicle.images);
    }
  }, [vehicle, form]);

  // When switching vehicle type, reset engineSize to a sensible default
  const handleTypeChange = (type: VehicleType) => {
    form.setValue("vehicleType", type, { shouldValidate: true });
    if (type === VehicleType.MOTA) {
      form.setValue("engineSize", 125);
    } else {
      form.setValue("engineSize", 2.0);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const result = await upload(file);
      if (result) {
        const newImages = [...images, result.url];
        setImages(newImages);
        form.setValue("images", newImages, { shouldValidate: true });
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    form.setValue("images", newImages, { shouldValidate: true });
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (isEdit && vehicle) {
        await updateVehicle(vehicle.id, data);
        toast.success("Veículo atualizado com sucesso!");
      } else {
        await createVehicle(data);
        toast.success("Veículo criado com sucesso!");
      }
      router.push("/admin/vehicles");
    } catch (error) {
      console.error("Failed to save vehicle", error);
      toast.error("Ocorreu um erro ao guardar o veículo.");
      form.reset();
      setImages([]);
    } finally {
      setIsSubmitting(false);
      form.reset();
      setImages([]);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-3 py-4 sm:p-6">
      <div className="flex items-center gap-4 mb-8 ">
        <Button
          variant="default"
          size="icon"
          className="animate-pulse"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-3xl font-display font-medium">
            {isEdit ? "Editar Veículo" : "Adicionar Novo Veículo"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Preencha os detalhes do veículo para ser apresentado na montra
            principal.
          </p>
        </div>
      </div>

      <div className="sm:p-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 sm:gap-8"
        >
          {/* ── Vehicle Type Selector Cards ── */}
          <div>
            <FieldLabel className="mb-3">Tipo de Veículo</FieldLabel>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md">
              <button
                type="button"
                onClick={() => handleTypeChange(VehicleType.CARRO)}
                className={`group relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 sm:p-6 transition-all duration-300 ${
                  !isMota
                    ? "border-gold bg-gold/10 shadow-lg shadow-gold/10"
                    : "border-border bg-card hover:border-gold/40 hover:bg-gold/5"
                }`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-300 ${
                    !isMota
                      ? "bg-gold text-background"
                      : "bg-muted text-muted-foreground group-hover:bg-gold/20 group-hover:text-gold"
                  }`}
                >
                  <Car className="h-7 w-7" />
                </div>
                <span
                  className={`text-sm font-semibold transition-colors ${
                    !isMota ? "text-gold" : "text-foreground"
                  }`}
                >
                  Carro
                </span>
                {!isMota && (
                  <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-gold animate-pulse" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange(VehicleType.MOTA)}
                className={`group relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 sm:p-6 transition-all duration-300 ${
                  isMota
                    ? "border-gold bg-gold/10 shadow-lg shadow-gold/10"
                    : "border-border bg-card hover:border-gold/40 hover:bg-gold/5"
                }`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-300 ${
                    isMota
                      ? "bg-gold text-background"
                      : "bg-muted text-muted-foreground group-hover:bg-gold/20 group-hover:text-gold"
                  }`}
                >
                  <Bike className="h-7 w-7" />
                </div>
                <span
                  className={`text-sm font-semibold transition-colors ${
                    isMota ? "text-gold" : "text-foreground"
                  }`}
                >
                  Mota
                </span>
                {isMota && (
                  <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-gold animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* ── Desktop: Side-by-side layout (inputs left, images right) ── */}
          {/* ── Mobile: Stacked layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
            {/* ── Left Column: All Form Fields ── */}
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  control={form.control}
                  name="brand"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="brand">Marca</FieldLabel>
                      <Input
                        id="brand"
                        placeholder="Ex: Toyota"
                        {...field}
                        className="bg-background"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="model"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="model">Modelo</FieldLabel>
                      <Input
                        id="model"
                        placeholder={
                          isMota ? "Ex: CB 500F" : "Ex: Land Cruiser"
                        }
                        {...field}
                        className="bg-background"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="year"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="year">Ano</FieldLabel>
                      <Input
                        id="year"
                        type="number"
                        {...field}
                        className="bg-background"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="price"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="price">Preço em AOA</FieldLabel>
                      <Input
                        id="price"
                        type="number"
                        {...field}
                        className="bg-background"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="engineSize"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="engineSize">
                        Cilindrada ({isMota ? "CC" : "L"})
                      </FieldLabel>
                      <Input
                        id="engineSize"
                        type="number"
                        step={isMota ? "1" : "0.1"}
                        {...field}
                        className="bg-background"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="fuel"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Combustível</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          className="bg-background"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Fuel).map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="transmission"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Transmissão</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          className="bg-background"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Transmission).map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="category"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Categoria</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          className="bg-background"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Category).map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Estado</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          className="bg-background"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Status).map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="badge"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Destaque (Opcional)</FieldLabel>
                      <Select
                        onValueChange={(val) =>
                          field.onChange(val === "none" ? undefined : val)
                        }
                        defaultValue={field.value || ""}
                      >
                        <SelectTrigger
                          className="bg-background"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Nenhum" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhum</SelectItem>
                          {Object.values(Badge).map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </div>

              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Descrição</FieldLabel>
                    <Textarea
                      id="description"
                      placeholder="Detalhes adicionais sobre o veículo..."
                      className="min-h-[100px] bg-background"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            {/* ── Right Column: Images (Desktop) / Below (Mobile) ── */}
            <div className="space-y-4">
              <FieldLabel>Imagens do Veículo</FieldLabel>

              <div className="relative flex flex-col items-center justify-center w-full h-32 sm:h-40 lg:h-52 border-2 border-dashed border-gold/50 rounded-xl hover:bg-gold/5 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gold">
                  {isUploading ? (
                    <Loader2 className="w-10 h-10 mb-2 animate-spin" />
                  ) : (
                    <Upload className="w-10 h-10 mb-2" />
                  )}
                  <p className="mb-2 text-sm">
                    <span className="font-semibold">
                      Clique para fazer upload
                    </span>{" "}
                    ou arraste uma imagem
                  </p>
                  <p className="text-xs opacity-70">JPG, PNG, WEBP (MAX. 10MB)</p>
                </div>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  {images.map((url, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Preview ${i}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {form.formState.errors.images && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.images.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-background px-8 py-6 text-base font-medium"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />A guardar...
                </>
              ) : (
                "Guardar Veículo"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
