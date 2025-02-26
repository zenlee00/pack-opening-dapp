import { useState } from "react";
import { ConnectWallet, useContract, useNFT, Web3Button } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const PACK_CONTRACT_ADDRESS = "YOUR_THIRDWEB_CONTRACT_ADDRESS"; // Replace with your contract address

export default function PackOpening() {
  const { contract } = useContract(PACK_CONTRACT_ADDRESS);
  const [openedCard, setOpenedCard] = useState(null);

  async function openPack() {
    if (!contract) return;

    try {
      const tx = await contract.call("openPack"); // Replace with actual function
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === "PackOpened");
      const tokenId = event.args[0].toNumber();

      const nft = await contract.erc1155.get(tokenId);
      setOpenedCard(nft);
    } catch (error) {
      console.error("Error opening pack:", error);
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>PEV Racers Pack Opening</h1>
      <ConnectWallet />
      <br />
      <Web3Button contractAddress={PACK_CONTRACT_ADDRESS} action={openPack}>
        Open Pack
      </Web3Button>
      {openedCard && (
        <div>
          <h2>You Pulled:</h2>
          <img src={openedCard.metadata.image} alt={openedCard.metadata.name} width={300} />
          <p>{openedCard.metadata.name}</p>
        </div>
      )}
    </div>
  );
}
