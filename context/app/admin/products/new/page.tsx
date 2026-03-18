"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function NewProduct() {
  const [title, setTitle] = useState("")
  const [points, setPoints] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")

  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [file, setFile] = useState<File | null>(null)

  const [thumbnailPreview, setThumbnailPreview] = useState("")
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const [loading, setLoading] = useState(false)

  const MAX_DETAIL_IMAGES = 8
const MAX_IMAGE_SIZE = 500 * 1024 * 1024
  useEffect(() => {
    if (!thumbnail) {
      setThumbnailPreview("")
      return
    }

    const url = URL.createObjectURL(thumbnail)
    setThumbnailPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [thumbnail])

  useEffect(() => {
    const urls = images.map((img) => URL.createObjectURL(img))
    setImagePreviews(urls)

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [images])

  const isImageFile = (file: File) => {
  return (
    file.type.startsWith("image/") ||
    /\.(png|jpg|jpeg|webp|gif)$/i.test(file.name)
  )
}

const addImages = (newFiles: File[]) => {

  const onlyImages = newFiles.filter(isImageFile)

  if (onlyImages.length !== newFiles.length) {
    alert("画像ファイルのみ選択してください")
    return
  }

  // サイズチェック
  for (const img of onlyImages) {
    if (img.size > MAX_IMAGE_SIZE) {
      alert("画像は500MB以内にしてください")
      return
    }
  }

  if (images.length + onlyImages.length > MAX_DETAIL_IMAGES) {
    alert(`商品画像は最大${MAX_DETAIL_IMAGES}枚までです`)
    return
  }

  setImages((prev) => [...prev, ...onlyImages])
}

  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = e.target.files?.[0]
    if (!selected) return

if (!isImageFile(selected)) {
  alert("画像ファイルを選択してください")
  return
}

if (selected.size > MAX_IMAGE_SIZE) {
  alert("画像は500MB以内にしてください")
  return
}

    setThumbnail(selected)
  }

const handleImagesChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  const selected = Array.from(e.target.files || [])

  if (images.length + selected.length > MAX_DETAIL_IMAGES) {
    alert(`商品画像は最大${MAX_DETAIL_IMAGES}枚までです`)
    return
  }

  addImages(selected)
}

const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const selected = e.target.files?.[0]
  if (!selected) return

  if (selected.size > 4 * 1024 * 1024 * 1024) {
    alert("ファイルは4GB以内にしてください")
    return
  }

  setFile(selected)
}

  const handleThumbnailDrop = (
    e: React.DragEvent<HTMLElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files?.[0]
    if (!droppedFile) return

    if (!isImageFile(droppedFile)) {
      alert("画像ファイルをドロップしてください")
      return
    }

    setThumbnail(droppedFile)
  }

  const handleImagesDrop = (
    e: React.DragEvent<HTMLElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFiles = Array.from(e.dataTransfer.files || [])
    if (droppedFiles.length === 0) return

    addImages(droppedFiles)
  }

  const handleFileDrop = (
  e: React.DragEvent<HTMLElement>
) => {
  e.preventDefault()
  e.stopPropagation()

  const droppedFile = e.dataTransfer.files?.[0]
  if (!droppedFile) return

  if (droppedFile.size > 4 * 1024 * 1024 * 1024) {
    alert("ファイルは4GB以内にしてください")
    return
  }

  setFile(droppedFile)
}

const removeThumbnail = () => {

  if (thumbnailPreview) {
    URL.revokeObjectURL(thumbnailPreview)
  }

  setThumbnail(null)
  setThumbnailPreview("")
}

const removeImage = (index: number) => {

  const url = imagePreviews[index]
  if (url) URL.revokeObjectURL(url)

  setImages(prev => prev.filter((_, i) => i !== index))
  setImagePreviews(prev => prev.filter((_, i) => i !== index))
}

const resetForm = () => {

  imagePreviews.forEach(url => URL.revokeObjectURL(url))

  if (thumbnailPreview) {
    URL.revokeObjectURL(thumbnailPreview)
  }

  setTitle("")
  setPoints("")
  setDescription("")
  setCategory("")
  setThumbnail(null)
  setImages([])
  setFile(null)
  setThumbnailPreview("")
  setImagePreviews([])
}

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (!title || !points || !thumbnail || !description || !category || !file) {
      alert("必須項目を入力してください")
      return
    }

    setLoading(true)

    try {
      const unique = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`

// 1. サムネイルアップロード
const thumbnailPath = `thumbnails/${unique}-thumb-${thumbnail.name}`

const { error: thumbError } = await supabase.storage
  .from("product-files")
  .upload(thumbnailPath, thumbnail, { upsert: false })
if (thumbError) {
  alert(`サムネイルアップロード失敗: ${thumbError.message}`)
  setLoading(false)
  return
}
const { data: thumbData } = supabase.storage
  .from("product-files")
  .getPublicUrl(thumbnailPath)

const thumbnailUrl = thumbData?.publicUrl || ""


// 2. 商品画像アップロード
const imageUrls: string[] = []

for (let i = 0; i < images.length; i++) {
  const img = images[i]

  const imagePath = `images/${unique}-detail-${i + 1}-${img.name}`

  const { error: imageError } = await supabase.storage
    .from("product-files")
    .upload(imagePath, img, { upsert: false })
if (imageError) {
  alert(`商品画像アップロード失敗: ${imageError.message}`)
  setLoading(false)
  return
}
  const { data: imageData } = supabase.storage
    .from("product-files")
    .getPublicUrl(imagePath)

  imageUrls.push(imageData?.publicUrl || "")
}


// 3. 商品ファイルアップロード
const filePath = `products/${unique}-${file.name}`

const { error: fileError } = await supabase.storage
  .from("product-files")
  .upload(filePath, file, { upsert: false })
if (fileError) {
  alert(`商品ファイルアップロード失敗: ${fileError.message}`)
  setLoading(false)
  return
}
const { data: fileData } = supabase.storage
  .from("product-files")
  .getPublicUrl(filePath)

const downloadUrl = fileData?.publicUrl || ""

      // 4. DB保存
      const { error: insertError } = await supabase
        .from("products")
        .insert([
          {
            title: title,
            points: Number(points),
            description: description,
            category_id: Number(category),
            thumbnail_url: thumbnailUrl,
            images: imageUrls,
            download_url: downloadUrl,
            file_path: filePath,
          },
        ])

      if (insertError) {
        alert(insertError.message)
        setLoading(false)
        return
      }

      alert("商品登録成功")
      resetForm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>商品登録</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="商品タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />
        <br />

<input
  type="number"
  min="0"
  placeholder="ポイント"
  value={points}
  onChange={(e) => setPoints(e.target.value)}
/>

        <br />
        <br />

        <textarea
          placeholder="商品説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          style={{ width: "300px" }}
        />

        <br />
        <br />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">カテゴリ選択</option>
          <option value="1">動画</option>
          <option value="2">画像</option>
          <option value="3">セット</option>
          <option value="4">プレミアム</option>
          <option value="5">無料</option>
        </select>

        <br />
        <br />

<p>サムネイル画像（必須）</p>

{!thumbnail && (
  <div
    onDrop={handleThumbnailDrop}
    onDragOver={(e) => {
  e.preventDefault()
  e.stopPropagation()
}}
    style={{
      border: "2px dashed #aaa",
      padding: "30px",
      borderRadius: "10px",
      width: "320px",
      textAlign: "center",
      cursor: "pointer",
    }}
  >
    <input
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      id="thumbnailUpload"
      onChange={handleThumbnailChange}
    />

    <label htmlFor="thumbnailUpload">
      ここにサムネイル画像をドロップ
      <br />
      またはクリックして選択
    </label>
  </div>
)}

{thumbnail && (
  <div>
    <p>選択中: {thumbnail.name}</p>

{thumbnailPreview && (
  <img
    src={thumbnailPreview}
    alt="thumbnail preview"
    style={{
      width: "180px",
      borderRadius: "10px",
      marginBottom: "10px",
    }}
  />
)}

    <button type="button" onClick={removeThumbnail}>
      サムネイル削除
    </button>
  </div>
)}

        <br />




<p>商品画像（任意 / 最大8枚）</p>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4,100px)",
    gap: "10px",
    marginTop: "20px",
  }}
>

{images.map((img, index) => (
  <div key={index} style={{ position: "relative" }}>
    {imagePreviews[index] && (
      <img
        src={imagePreviews[index]}
        alt=""
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    )}

    <button
      type="button"
      onClick={() => removeImage(index)}
      style={{
        position: "absolute",
        top: "-8px",
        right: "-8px",
        background: "red",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        cursor: "pointer",
        fontSize: "12px",
      }}
    >
      ×
    </button>
  </div>
))}

{images.length < MAX_DETAIL_IMAGES && (
<label
  htmlFor="imagesUpload"
  onDrop={handleImagesDrop}
  onDragOver={(e) => {
    e.preventDefault()
    e.stopPropagation()
  }}
  style={{
    width: "100px",
    height: "100px",
    border: "2px dashed #aaa",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "30px",
    color: "#888",
  }}
>
  ＋
</label>
)}

</div>

<input
  type="file"
  accept="image/*"
  multiple
  style={{ display: "none" }}
  id="imagesUpload"
  onChange={handleImagesChange}
/>

<p>商品ファイル</p>

{!file && (
  <div
    onDrop={handleFileDrop}
    onDragOver={(e) => {
  e.preventDefault()
  e.stopPropagation()
}}
    style={{
      border: "2px dashed #aaa",
      padding: "40px",
      borderRadius: "10px",
      width: "320px",
      textAlign: "center",
      cursor: "pointer",
    }}
  >
<input
  type="file"
  accept=".zip,.rar,.7z,image/*,video/*"
  style={{ display: "none" }}
  id="fileUpload"
  onChange={handleFileChange}
/>

    <label htmlFor="fileUpload">
      ここに商品ファイルをドロップ
      <br />
      またはクリックして選択
    </label>
  </div>
)}

{file && (
  <div>
    <p>選択ファイル: {file.name}</p>

    <button
      type="button"
      onClick={() => setFile(null)}
    >
      ファイル削除
    </button>
  </div>
)}

        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "登録中..." : "登録"}
        </button>
      </form>
    </div>
  )
}