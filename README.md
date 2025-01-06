# SparkCast

A CLI utility to interactively send emails to any audience using MongoDB and SparkPost.

<img src="/preview.png" width="377" height="243" />

## Why?

SparkCast helps indie hackers and makers send transactional emails to their audience without the complexity and cost of a full email marketing platform. Simply write your emails in markdown files and let SparkCast handle the rest.

## Requirements

- Bun 1.1.x
- Node 18.x
- MongoDB 6.x
- SparkPost [API Key](https://app.sparkpost.com/account/api-keys)

## Installation

```bash
git clone https://github.com/stewones/spark-cast.git
cd spark-cast
bun install
```

## Setup

Edit the `.env` file with your own values.

- `MONGO_URI` - The URI of your MongoDB database
- `SPARKPOST_API_KEY` - The API key of your SparkPost account
- `EMAIL_FROM_NAME` - The name of the sender
- `EMAIL_FROM_EMAIL` - The email address of the sender
- `EMAIL_REPLY_TO` - The email address to reply to

## Important

Open the [`src/query.ts`](src/query.ts.example) file and make sure the params matches your MongoDB schema.

## Usage

Create your email content as markdown files and save them in the `emails` directory.

Then send your emails by running this command:

```bash
spark
```

or

```bash
bun run src/cli.ts
```

That's it!

## Testing

To test locally, you can run MongoDB in a Docker container and add sample data. You'll need Docker installed on your computer - download it [here](https://docs.docker.com/get-docker/). Mac users can also use [Orb Stack](https://orbstack.dev/) as a lightweight alternative.

```bash
bun run db:build
bun run db:run
bun run db:seed
```

then run the `spark` command to test it out.

> Note: when using a local MongoDB connection (MONGO_URI pointing to localhost), emails will not be sent as the service runs in sandbox mode for development safety.

## License

MIT

## Sponsor

Looking to [post to multiple social media at once](https://statuz.gg)? Check out [Statuz](https://statuz.gg). It lets you post your content to multiple platforms like X, BlueSky and Mastodon in just one click.
