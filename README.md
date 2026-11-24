# Skyfind Return Compass

SkyAssist — Airport Lost-and-Found Item Matching SystemMain modules

1. Passenger Registration — Register users and their contact details.

2. Lost Item Reporting — Enter item type, colour, description, location, and time.

3. Found Item Registration — Airport staff record recovered belongings.

4. Item Matching — Match lost and found reports using category, colour, location, and description.

5. Claim Verification — Staff verify ownership before returning an item.

6. Status Tracking — Track reports from Lost to Matched, Under Verification, and Returned.

7. Reports Dashboard — Show successful matches, pending claims, and unclaimed items.

Why this is suitable

- It is more specialized than a general airport management system.

- You can implement matching with simple scoring rules rather than complex AI.

- It has clear database entities: Passenger, LostItem, FoundItem, MatchRecord, and Claim.

- It supports all your required UML diagrams and report sections.

- You can demonstrate it using sample airport data without connecting to a real airport.

Suggested technology: Java + MySQL, or Python Flask + MySQL.



The key distinctive feature is the item-matching and ownership-verification workflow, rather than simply recording lost property. Similar systems may exist elsewhere, so I would describe it as a specialized project idea rather than claim worldwide uniqueness. I want to build a web with this information

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://skyfind-return-compass.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6b373dd5-054b-4ff8-bd03-443a94cc7dd4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
