## 📁 Command Category: Giveaway

### 💾 `/giveaway`

**Description:** 🎉 Create a giveaway event

### 💻 Usage

`/giveaway start <duration> <winners> <prize> [description] [color] [role]`
`/giveaway end <giveaway>`
`/giveaway cancel <giveaway>`
`/giveaway reroll <giveaway>`

### 🔧 Subcommands

**`/giveaway start <duration> <winners> <prize> [<description>] [<color>] [<role>]`**
> Start a giveaway

**Options for this subcommand:**
- **`duration*`**
  - **Description:** Duration (1d 2h)
  - **Type:** Text
- **`winners*`**
  - **Description:** Count
  - **Type:** Integer
- **`prize*`**
  - **Description:** Prize
  - **Type:** Text
- **`description`**
  - **Description:** Description for the giveaway
  - **Type:** Text
- **`color`**
  - **Description:** Hex Color
  - **Type:** Text
- **`role`**
  - **Description:** Req Role
  - **Type:** Role
**`/giveaway end <giveaway>`**
> End a giveaway manually

**Options for this subcommand:**
- **`giveaway*`**
  - **Description:** Search active giveaway
  - **Type:** Text
**`/giveaway cancel <giveaway>`**
> Cancel a running giveaway

**Options for this subcommand:**
- **`giveaway*`**
  - **Description:** Search active giveaway
  - **Type:** Text
**`/giveaway reroll <giveaway>`**
> Reroll winners for a finished giveaway

**Options for this subcommand:**
- **`giveaway*`**
  - **Description:** Search ended giveaway
  - **Type:** Text


