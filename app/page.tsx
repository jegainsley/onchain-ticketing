// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Avatar, Name, Identity, Address, EthBalance } from '@coinbase/onchainkit/identity';

interface Ticket {
  id: string;
  name: string;
  price: number;
  inventory: number;
  imageUrl: string;
  description: string;
}

export default function TicketPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const router = useRouter();

  // Fetch ticket data from Airtable
  useEffect(() => {
    async function fetchTickets() {
      const response = await fetch('/api/fetchTickets');
      const data = await response.json();
      setTickets(data.tickets);
    }
    fetchTickets();
  }, []);

  // Navigate to information collection page with selected ticket details
  const handleSelectTicket = (ticket: Ticket) => {
    router.push(`/info?ticketId=${ticket.id}&name=${ticket.name}&price=${ticket.price}&imageUrl=${ticket.imageUrl}&description=${ticket.description}&inventory=${ticket.inventory}`);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <header className="pt-4 pr-4 flex justify-end">
        <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
              <EthBalance />
            </Identity>
            <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com" target="_blank" rel="noopener noreferrer">
              Wallet
            </WalletDropdownLink>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full">
          <h1 className="text-3xl font-bold mb-4">Available Tickets</h1>
          {tickets.map((ticket) => (
            <div key={ticket.id} className="mb-4 p-4 border rounded-lg">
              <img src={ticket.imageUrl} alt={ticket.name} className="w-full h-48 object-cover mb-4 rounded" />
              <h2 className="text-xl font-semibold">{ticket.name}</h2>
              <p className="mb-2">{ticket.description}</p>
              <p>Price: {ticket.price} USDC</p>
              {ticket.inventory > 0 ? (
                <button
                  onClick={() => handleSelectTicket(ticket)}
                  className="bg-[#105EFF] text-white px-4 py-2 rounded mt-2"
                >
                  Select
                </button>
              ) : (
                <p className="text-red-500">Sold Out</p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}