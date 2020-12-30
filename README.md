# acady

CLI tool to create, bootstrap, deploy and manage serverless / jamstack components.

# Idea
In contrast to software development in the good old mainframe days, Nowadays you do not build a big monolith.
But you build many smaller components which are more or less independent of each other.

Over time, you build tens or even hundreds of components that all have to be created, bootstrapped, deployed and managed.

This is where acady comes into place. Acady helps you do those recurring tasks that are often similar but never equal and so difficult to automate and annoying for each web developer.

The goal of acady is to give you a tool that helps you build great software even faster.
Regardless of whether you are building a Task Worker on AWS Lambda, a Gatsby Site on Vercel, a REST API on Clouflare Workers ... acady can assist you.

# Installation

## NPM
```
npm i -g acady
```

### Yarn
```
yarn global add acady
```


# Commands

## Components (Create, List, Remove)

### Create
Starts interface for creating a new component
```
Usage: acady create [options]

Create a new component

Options:
  -t, --type <type>        Type of new component
  -h, --hosting <hosting>  Hosting to use
  -i, --id <id>            Bootstrap an existing component
  -d, --debug              activate debug mode
  -p, --profile            use a profile
  --help                   display help for command

```

### List
List existing components
```
Usage: acady list [options]

List components

Options:
  -d, --debug    activate debug mode
  -p, --profile  use a profile
  -h, --help     display help for command
```

### Remove
Remove an existing components
```
Usage: acady remove [options]

Remove a component

Options:
  -d, --debug    activate debug mode
  -p, --profile  use a profile
  -h, --help     display help for command

```
