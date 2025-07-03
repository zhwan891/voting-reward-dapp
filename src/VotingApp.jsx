import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const WEBSITES = [
  { id: 1, name: "example.com", description: "A well-known information hub." },
  { id: 2, name: "trustsite.org", description: "A transparent community platform." },
  { id: 3, name: "mysite.xyz", description: "A fresh and reliable tech blog." },
];

export default function VotingApp() {
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedSite, setSelectedSite] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [reward, setReward] = useState(0);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } else {
        alert("Please install MetaMask to vote.");
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const handleVote = () => {
    if (!selectedSite) return alert("Please select a website to vote.");
    localStorage.setItem(`vote-${walletAddress}`, selectedSite);
    setHasVoted(true);
    if (selectedSite === "trustsite.org") {
      setReward(1);
    }
  };

  useEffect(() => {
    if (!walletAddress) return;
    const storedVote = localStorage.getItem(`vote-${walletAddress}`);
    if (storedVote) {
      setSelectedSite(storedVote);
      setHasVoted(true);
    }
  }, [walletAddress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🌐 Community Trust Voting</h1>
          <p className="text-gray-600">Vote for websites you believe are most trustworthy. If your vote aligns with the majority, you'll earn rewards!</p>
        </header>

        {!walletAddress ? (
          <div className="text-center">
            <button
              onClick={connectWallet}
              className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            <div className="text-center text-sm text-gray-600">
              Connected: <span className="font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {WEBSITES.map((site) => (
                <div
                  key={site.id}
                  onClick={() => !hasVoted && setSelectedSite(site.name)}
                  className={`cursor-pointer p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition ${
                    selectedSite === site.name ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
                  }`}
                >
                  <h2 className="text-xl font-semibold text-gray-800">{site.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{site.description}</p>
                </div>
              ))}
            </div>

            {!hasVoted ? (
              <div className="text-center mt-6">
                <button
                  onClick={handleVote}
                  className="py-2 px-5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Submit Vote
                </button>
              </div>
            ) : (
              <div className="text-center mt-6 text-green-700 text-lg">
                ✅ You’ve successfully voted!
                {reward > 0 && (
                  <div className="mt-2 text-yellow-600 text-sm">🎉 You earned {reward} token(s) for your choice!</div>
                )}
              </div>
            )}
          </>
        )}

        <footer className="text-center text-xs text-gray-400 mt-10">
          Powered by Ethereum · Built with React & ethers.js
        </footer>
      </div>
    </div>
  );
}
